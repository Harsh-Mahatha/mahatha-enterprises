import type { Product } from "./product";

export type StockMovementType = "STOCK_ENTRY" | "SALE" | "ADJUSTMENT";

export type StockMovement = {
  id: string;
  productId: string;
  product?: Product;
  type: StockMovementType;
  quantity: string;
  balanceAfter: string;
  invoiceId: string | null;
  reason: string | null;
  notes: string | null;
  date: string;
  createdAt: string;
};
