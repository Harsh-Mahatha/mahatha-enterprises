import type { PaginatedData, Product, StockMovement } from "@mahatha/types";
import { apiRequest, buildQuery } from "./client";

export type ListStockMovementsParams = {
  page?: number;
  pageSize?: number;
  productId?: string;
};

export type StockEntryInput = {
  productId: string;
  quantity: number;
  date: string;
  reason?: string;
  notes?: string;
};

export type StockAdjustmentInput = {
  productId: string;
  actualStock: number;
  reason: string;
  notes?: string;
};

export function listStockMovements(params: ListStockMovementsParams = {}) {
  return apiRequest<PaginatedData<StockMovement>>(`/api/inventory/movements${buildQuery(params)}`);
}

export function createStockEntry(input: StockEntryInput) {
  return apiRequest<Product>("/api/inventory/entries", { method: "POST", body: input });
}

export function createStockAdjustment(input: StockAdjustmentInput) {
  return apiRequest<Product>("/api/inventory/adjustments", { method: "POST", body: input });
}
