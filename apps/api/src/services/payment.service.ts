import type { CreatePaymentInput, ListPaymentsQuery } from "@mahatha/validation";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/error-handler";
import * as customerRepository from "../repositories/customer.repository";
import * as ledgerRepository from "../repositories/ledger.repository";
import * as paymentRepository from "../repositories/payment.repository";

export async function listPayments(query: ListPaymentsQuery) {
  const skip = (query.page - 1) * query.pageSize;
  const [items, totalItems] = await paymentRepository.findPayments({
    customerId: query.customerId,
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

export async function getPayment(id: string) {
  const payment = await paymentRepository.findPaymentById(id);
  if (!payment) {
    throw new AppError("Payment not found.", 404, "NOT_FOUND");
  }
  return payment;
}

export async function createPayment(input: CreatePaymentInput) {
  return prisma.$transaction(async (tx) => {
    const customer = await customerRepository.findCustomerById(input.customerId, tx);
    if (!customer) {
      throw new AppError("Customer not found.", 404, "NOT_FOUND");
    }

    const lastEntry = await ledgerRepository.findLatestLedgerEntry(input.customerId, tx);
    const currentOutstanding = lastEntry ? Number(lastEntry.balanceAfter) : 0;

    if (input.amount > currentOutstanding) {
      throw new AppError(
        `Payment cannot exceed the outstanding balance of ${currentOutstanding}.`,
        400,
        "PAYMENT_EXCEEDS_OUTSTANDING",
      );
    }

    const payment = await paymentRepository.createPayment(
      {
        customerId: input.customerId,
        amount: input.amount,
        mode: input.mode,
        date: input.date,
        reference: input.reference,
        notes: input.notes,
      },
      tx,
    );

    await ledgerRepository.createLedgerEntry(
      {
        customerId: input.customerId,
        type: "PAYMENT",
        amount: -input.amount,
        balanceAfter: currentOutstanding - input.amount,
        date: input.date,
        paymentId: payment.id,
      },
      tx,
    );

    return payment;
  });
}
