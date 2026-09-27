export type Unit = {
  id: string;
  name: string;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  unit: string;
  mrp: string;
  sellingPrice: string;
  minStockLevel: number;
  currentStock: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
