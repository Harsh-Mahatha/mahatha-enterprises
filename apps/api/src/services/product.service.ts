import type { CreateProductInput, ListProductsQuery, UpdateProductInput } from "@mahatha/validation";
import { AppError } from "../middleware/error-handler";
import * as productRepository from "../repositories/product.repository";

export async function listProducts(query: ListProductsQuery) {
  const skip = (query.page - 1) * query.pageSize;
  const [items, totalItems] = await productRepository.findProducts({
    search: query.search,
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

export async function getProduct(id: string) {
  const product = await productRepository.findProductById(id);
  if (!product) {
    throw new AppError("Product not found.", 404, "NOT_FOUND");
  }
  return product;
}

export async function createProduct(input: CreateProductInput) {
  return productRepository.createProduct({
    name: input.name,
    sku: input.sku,
    unit: input.unit,
    sellingPrice: input.sellingPrice,
    minStockLevel: input.minStockLevel,
  });
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  await getProduct(id);
  return productRepository.updateProduct(id, {
    name: input.name,
    sku: input.sku,
    unit: input.unit,
    sellingPrice: input.sellingPrice,
    minStockLevel: input.minStockLevel,
  });
}

export async function setProductActive(id: string, active: boolean) {
  await getProduct(id);
  return productRepository.setProductActive(id, active);
}
