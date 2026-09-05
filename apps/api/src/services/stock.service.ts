import type { ListStockMovementsQuery, StockAdjustmentInput, StockEntryInput } from "@mahatha/validation";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/error-handler";
import * as productRepository from "../repositories/product.repository";
import * as stockMovementRepository from "../repositories/stock-movement.repository";

export async function listStockMovements(query: ListStockMovementsQuery) {
  const skip = (query.page - 1) * query.pageSize;
  const [items, totalItems] = await stockMovementRepository.findStockMovements({
    productId: query.productId,
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

export async function createStockEntry(input: StockEntryInput) {
  return prisma.$transaction(async (tx) => {
    const product = await productRepository.findProductById(input.productId, tx);
    if (!product) {
      throw new AppError("Product not found.", 404, "NOT_FOUND");
    }

    const balanceAfter = Number(product.currentStock) + input.quantity;

    await stockMovementRepository.createStockMovement(
      {
        productId: product.id,
        type: "STOCK_ENTRY",
        quantity: input.quantity,
        balanceAfter,
        date: input.date,
        reason: input.reason,
        notes: input.notes,
      },
      tx,
    );

    return productRepository.adjustCurrentStock(product.id, input.quantity, tx);
  });
}

export async function createStockAdjustment(input: StockAdjustmentInput) {
  return prisma.$transaction(async (tx) => {
    const product = await productRepository.findProductById(input.productId, tx);
    if (!product) {
      throw new AppError("Product not found.", 404, "NOT_FOUND");
    }

    const delta = input.actualStock - Number(product.currentStock);

    await stockMovementRepository.createStockMovement(
      {
        productId: product.id,
        type: "ADJUSTMENT",
        quantity: delta,
        balanceAfter: input.actualStock,
        date: new Date(),
        reason: input.reason,
        notes: input.notes,
      },
      tx,
    );

    return productRepository.adjustCurrentStock(product.id, delta, tx);
  });
}
