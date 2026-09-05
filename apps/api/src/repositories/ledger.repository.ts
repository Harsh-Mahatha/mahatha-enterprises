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
