import type { Prisma, PrismaClient, StockMovementType } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = PrismaClient | Prisma.TransactionClient;

export type StockMovementWriteData = {
  productId: string;
  type: StockMovementType;
  quantity: number;
  balanceAfter: number;
  date: Date;
  invoiceId?: string;
  reason?: string;
  notes?: string;
};

export function createStockMovement(data: StockMovementWriteData, client: Client = prisma) {
  return client.stockMovement.create({ data });
}

export function findStockMovements(
  params: { productId?: string; skip: number; take: number },
  client: Client = prisma,
) {
  const where: Prisma.StockMovementWhereInput = params.productId ? { productId: params.productId } : {};

  return Promise.all([
    client.stockMovement.findMany({
      where,
      orderBy: { date: "desc" },
      skip: params.skip,
      take: params.take,
      include: { product: true },
    }),
    client.stockMovement.count({ where }),
  ]);
}
