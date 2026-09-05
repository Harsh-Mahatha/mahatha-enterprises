import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = PrismaClient | Prisma.TransactionClient;

export function createLedgerEntry(
  data: {
    customerId: string;
    type: "OPENING_BALANCE" | "INVOICE" | "PAYMENT";
    amount: number;
    balanceAfter: number;
    date: Date;
    invoiceId?: string;
    paymentId?: string;
    notes?: string;
  },
  client: Client = prisma,
) {
  return client.customerLedgerEntry.create({ data });
}

export function findLatestLedgerEntry(customerId: string, client: Client = prisma) {
  return client.customerLedgerEntry.findFirst({
    where: { customerId },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });
}

export function findLedgerEntries(
  params: { customerId: string; skip: number; take: number },
  client: Client = prisma,
) {
  const where: Prisma.CustomerLedgerEntryWhereInput = { customerId: params.customerId };

  return Promise.all([
    client.customerLedgerEntry.findMany({
      where,
      orderBy: [{ date: "asc" }, { createdAt: "asc" }],
      skip: params.skip,
      take: params.take,
    }),
    client.customerLedgerEntry.count({ where }),
  ]);
}
