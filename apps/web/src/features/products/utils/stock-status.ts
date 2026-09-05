export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export function getStockStatus(currentStock: number, minStockLevel: number): StockStatus {
  if (currentStock <= 0) return "OUT_OF_STOCK";
  if (currentStock <= minStockLevel) return "LOW_STOCK";
  return "IN_STOCK";
}

export const stockStatusLabel: Record<StockStatus, string> = {
  IN_STOCK: "In stock",
  LOW_STOCK: "Low stock",
  OUT_OF_STOCK: "Out of stock",
};

export const stockStatusVariant: Record<StockStatus, "success" | "warning" | "error"> = {
  IN_STOCK: "success",
  LOW_STOCK: "warning",
  OUT_OF_STOCK: "error",
};
