import type { PaginatedData, Product, ProductUnit } from "@mahatha/types";
import { apiRequest, buildQuery } from "./client";

export type ListProductsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type ProductInput = {
  name: string;
  sku: string;
  unit: ProductUnit;
  sellingPrice: number;
  minStockLevel: number;
};

export function listProducts(params: ListProductsParams = {}) {
  return apiRequest<PaginatedData<Product>>(`/api/products${buildQuery(params)}`);
}

export function getProduct(id: string) {
  return apiRequest<Product>(`/api/products/${id}`);
}

export function createProduct(input: ProductInput) {
  return apiRequest<Product>("/api/products", { method: "POST", body: input });
}

export function updateProduct(id: string, input: ProductInput) {
  return apiRequest<Product>(`/api/products/${id}`, { method: "PATCH", body: input });
}

export function setProductActive(id: string, active: boolean) {
  return apiRequest<Product>(`/api/products/${id}/status`, { method: "PATCH", body: { active } });
}
