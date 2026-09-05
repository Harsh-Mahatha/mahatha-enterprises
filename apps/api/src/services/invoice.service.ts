import type { CreateInvoiceInput, ListInvoicesQuery } from "@mahatha/validation";
import { calculateInvoice, validateInvoiceCalculation } from "@mahatha/calculations";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/error-handler";
import * as companySettingsService from "./company-settings.service";
import * as customerRepository from "../repositories/customer.repository";
import * as invoiceRepository from "../repositories/invoice.repository";
import * as ledgerRepository from "../repositories/ledger.repository";
import * as paymentRepository from "../repositories/payment.repository";
import * as productRepository from "../repositories/product.repository";
import * as stockMovementRepository from "../repositories/stock-movement.repository";

export async function listInvoices(query: ListInvoicesQuery) {
  const skip = (query.page - 1) * query.pageSize;
  const [items, totalItems] = await invoiceRepository.findInvoices({
    search: query.search,
    customerId: query.customerId,
    status: query.status,
    skip,
    take: query.pageSize,
  });

  return {
    items,
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / query.pageSize)),
    },
  };
}

export async function getInvoice(id: string) {
  const invoice = await invoiceRepository.findInvoiceById(id);
  if (!invoice) {
    throw new AppError("Invoice not found.", 404, "NOT_FOUND");
  }
  return invoice;
}

function computeInvoiceStatus(total: number, amountPaid: number): "PAID" | "PARTIAL" | "UNPAID" {
  if (amountPaid <= 0) return "UNPAID";
  if (amountPaid >= total) return "PAID";
  return "PARTIAL";
}

export async function createInvoice(input: CreateInvoiceInput) {
  // Recalculate server-side — the client's numbers are never trusted for persistence.
  const calculation = calculateInvoice({
    items: input.items,
    discounts: input.discounts,
    paymentReceived: input.paymentReceived,
  });

  const issues = validateInvoiceCalculation(calculation);
  if (issues.length > 0) {
    throw new AppError(issues[0].message, 400, "INVALID_INVOICE_CALCULATION");
  }

  const companySettings = await companySettingsService.getCompanySettings();

  const invoiceId = await prisma.$transaction(async (tx) => {
    const customer = await customerRepository.findCustomerById(input.customerId, tx);
    if (!customer) {
      throw new AppError("Customer not found.", 404, "NOT_FOUND");
    }
    if (!customer.active) {
      throw new AppError("Cannot bill an inactive customer.", 400, "CUSTOMER_INACTIVE");
    }

    // Verify every line has sufficient stock before writing anything.
    const products = new Map<string, Awaited<ReturnType<typeof productRepository.findProductById>>>();
    for (const item of input.items) {
      const product = await productRepository.findProductById(item.productId, tx);
      if (!product) {
        throw new AppError("One of the selected products could not be found.", 404, "NOT_FOUND");
      }
      if (!product.active) {
        throw new AppError(`${product.name} is inactive and cannot be sold.`, 400, "PRODUCT_INACTIVE");
      }
      if (Number(product.currentStock) < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}.`, 400, "INSUFFICIENT_STOCK");
      }
      products.set(item.productId, product);
    }

    // Sequential, race-free invoice numbering (INV-000001, ...).
    const counter = await tx.invoiceCounter.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", value: 1 },
      update: { value: { increment: 1 } },
    });
    const invoiceNumber = `${companySettings.invoicePrefix}${String(counter.value).padStart(6, "0")}`;

    const total = Number(calculation.total);
    const status = computeInvoiceStatus(total, input.paymentReceived);

    const invoice = await invoiceRepository.createInvoice(
      {
        invoiceNumber,
        customerId: input.customerId,
        date: input.date,
        subtotal: Number(calculation.subtotal),
        discountTotal: Number(calculation.discountTotal),
        total,
        amountPaid: input.paymentReceived,
        status,
        notes: input.notes,
      },
      tx,
    );

    for (let index = 0; index < input.items.length; index += 1) {
      const item = input.items[index];
      const product = products.get(item.productId)!;

      await invoiceRepository.createInvoiceItem(
        {
          invoiceId: invoice.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: Number(calculation.lineTotals[index]),
        },
        tx,
      );

      const stockBalanceAfter = Number(product.currentStock) - item.quantity;
      await stockMovementRepository.createStockMovement(
        {
          productId: item.productId,
          type: "SALE",
          quantity: -item.quantity,
          balanceAfter: stockBalanceAfter,
          invoiceId: invoice.id,
          date: input.date,
        },
        tx,
      );
      await productRepository.adjustCurrentStock(item.productId, -item.quantity, tx);
    }

    for (const discount of input.discounts) {
      await invoiceRepository.createInvoiceDiscount(
        { invoiceId: invoice.id, description: discount.description, amount: discount.amount },
        tx,
      );
    }

    let paymentId: string | undefined;
    if (input.paymentReceived > 0) {
      const payment = await paymentRepository.createPayment(
        {
          customerId: input.customerId,
          invoiceId: invoice.id,
          amount: input.paymentReceived,
          mode: input.paymentMode!,
          date: input.date,
        },
        tx,
      );
      paymentId = payment.id;
    }

    const lastEntry = await ledgerRepository.findLatestLedgerEntry(input.customerId, tx);
    let runningBalance = lastEntry ? Number(lastEntry.balanceAfter) : 0;

    runningBalance += total;
    await ledgerRepository.createLedgerEntry(
      {
        customerId: input.customerId,
        type: "INVOICE",
        amount: total,
        balanceAfter: runningBalance,
        invoiceId: invoice.id,
        date: input.date,
      },
      tx,
    );

    if (paymentId) {
      runningBalance -= input.paymentReceived;
      await ledgerRepository.createLedgerEntry(
        {
          customerId: input.customerId,
          type: "PAYMENT",
          amount: -input.paymentReceived,
          balanceAfter: runningBalance,
          invoiceId: invoice.id,
          paymentId,
          date: input.date,
        },
        tx,
      );
    }

    return invoice.id;
  });

  return invoiceRepository.findInvoiceById(invoiceId);
}
