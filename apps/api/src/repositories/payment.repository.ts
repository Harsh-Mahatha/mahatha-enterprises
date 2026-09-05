import type { Prisma, PrismaClient, PaymentMode } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = PrismaClient | Prisma.TransactionClient;

export type PaymentWriteData = {
  customerId: string;
  invoiceId?: string;
  amount: number;
  mode: PaymentMode;
  date: Date;
  reference?: string;
  notes?: string;
};

export function createPayment(data: PaymentWriteData, client: Client = prisma) {
  return client.payment.create({ data });
}

export function findPaymentById(id: string, client: Client = prisma) {
  return client.payment.findUnique({ where: { id } });
}

export function findPayments(
  params: { customerId?: string; skip: number; take: number },
  client: Client = prisma,
) {
  const where: Prisma.PaymentWhereInput = params.customerId ? { customerId: params.customerId } : {};

  return Promise.all([
    client.payment.findMany({
      where,
      orderBy: { date: "desc" },
      skip: params.skip,
      take: params.take,
      include: { customer: true },
    }),
    client.payment.count({ where }),
  ]);
}
