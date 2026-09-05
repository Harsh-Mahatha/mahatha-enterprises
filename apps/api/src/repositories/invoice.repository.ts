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

export function findInvoices(
  params: {
    search?: string;
    customerId?: string;
    status?: InvoiceStatus;
    skip: number;
    take: number;
  },
  client: Client = prisma,
) {
  const where: Prisma.InvoiceWhereInput = {
    ...(params.customerId ? { customerId: params.customerId } : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.search
      ? {
          OR: [
            { invoiceNumber: { contains: params.search, mode: "insensitive" } },
            { customer: { name: { contains: params.search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

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
