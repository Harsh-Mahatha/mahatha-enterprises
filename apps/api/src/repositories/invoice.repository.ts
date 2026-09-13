import type { InvoiceStatus, Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = PrismaClient | Prisma.TransactionClient;

const invoiceInclude = {
  customer: true,
  items: { include: { product: true } },
  discounts: true,
} satisfies Prisma.InvoiceInclude;

export type InvoiceCreateData = {
  invoiceNumber: string;
  customerId: string;
  date: Date;
  subtotal: number;
  discountTotal: number;
  total: number;
  amountPaid: number;
  status: InvoiceStatus;
  notes?: string;
};

export function createInvoice(data: InvoiceCreateData, client: Client = prisma) {
  return client.invoice.create({ data });
}

export type InvoiceItemCreateData = {
  invoiceId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export function createInvoiceItem(data: InvoiceItemCreateData, client: Client = prisma) {
  return client.invoiceItem.create({ data });
}

export type InvoiceDiscountCreateData = {
  invoiceId: string;
  description?: string;
  amount: number;
};

export function createInvoiceDiscount(data: InvoiceDiscountCreateData, client: Client = prisma) {
  return client.invoiceDiscount.create({ data });
}

export function findInvoiceById(id: string, client: Client = prisma) {
  return client.invoice.findUnique({ where: { id }, include: invoiceInclude });
}

export type InvoiceUpdateData = {
  date: Date;
  subtotal: number;
  discountTotal: number;
  total: number;
  status: InvoiceStatus;
  notes: string | null;
};

export function updateInvoice(id: string, data: InvoiceUpdateData, client: Client = prisma) {
  return client.invoice.update({ where: { id }, data });
}

// Line items and discounts aren't an audit trail the way stock movements and
// ledger entries are — on edit they're simply replaced (delete + recreate)
// rather than reconciled row by row.
export function deleteInvoiceItems(invoiceId: string, client: Client = prisma) {
  return client.invoiceItem.deleteMany({ where: { invoiceId } });
}

export function deleteInvoiceDiscounts(invoiceId: string, client: Client = prisma) {
  return client.invoiceDiscount.deleteMany({ where: { invoiceId } });
}

export type InvoiceFilterParams = {
  search?: string;
  customerId?: string;
  status?: InvoiceStatus;
  dateFrom?: Date;
  dateTo?: Date;
};

function buildInvoiceWhere(params: InvoiceFilterParams): Prisma.InvoiceWhereInput {
  return {
    ...(params.customerId ? { customerId: params.customerId } : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.dateFrom || params.dateTo
      ? {
          date: {
            ...(params.dateFrom ? { gte: params.dateFrom } : {}),
            ...(params.dateTo ? { lte: params.dateTo } : {}),
          },
        }
      : {}),
    ...(params.search
      ? {
          OR: [
            { invoiceNumber: { contains: params.search, mode: "insensitive" } },
            { customer: { name: { contains: params.search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };
}

export function findInvoices(
  params: InvoiceFilterParams & { skip: number; take: number },
  client: Client = prisma,
) {
  const where = buildInvoiceWhere(params);

  return Promise.all([
    client.invoice.findMany({
      where,
      include: { customer: true },
      orderBy: { date: "desc" },
      skip: params.skip,
      take: params.take,
    }),
    client.invoice.count({ where }),
  ]);
}

// Aggregates over the full filtered set (not just the current page) — used
// by the Sales Report summary, built on the same where-clause as the list
// above so the two never drift apart.
export function aggregateInvoices(params: InvoiceFilterParams, client: Client = prisma) {
  const where = buildInvoiceWhere(params);
  return client.invoice.aggregate({ where, _sum: { total: true, amountPaid: true } });
}
