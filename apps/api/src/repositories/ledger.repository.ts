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

// Ordered by createdAt (true recording order), not the user-editable `date`
// field. balanceAfter is a running total computed at write time from
// whatever the previous entry's balanceAfter was — that chain must follow
// actual insertion order, or a same-day entry could read a balance that
// wasn't really "latest" yet (e.g. an opening-balance entry stamped with a
// precise creation timestamp vs. a same-day invoice/payment date coerced to
// midnight). V1 is append-only, not a backdated/recalculating ledger.
export function findLatestLedgerEntry(customerId: string, client: Client = prisma) {
  return client.customerLedgerEntry.findFirst({
    where: { customerId },
    orderBy: { createdAt: "desc" },
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
      orderBy: { createdAt: "asc" },
      skip: params.skip,
      take: params.take,
    }),
    client.customerLedgerEntry.count({ where }),
  ]);
}
