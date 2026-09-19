export type ProductUnit = "PIECE" | "BOX" | "KG" | "LITRE" | "METER";

export type Product = {
  id: string;
  name: string;
  sku: string;
  unit: ProductUnit;
  mrp: string;
  sellingPrice: string;
  minStockLevel: number;
  currentStock: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
