import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = PrismaClient | Prisma.TransactionClient;

export function findProducts(params: { search?: string; skip: number; take: number }, client: Client = prisma) {
  const where: Prisma.ProductWhereInput = params.search
    ? {
        OR: [
          { name: { contains: params.search, mode: "insensitive" } },
          { sku: { contains: params.search, mode: "insensitive" } },
        ],
      }
    : {};

  return Promise.all([
    client.product.findMany({
      where,
      orderBy: { name: "asc" },
      skip: params.skip,
      take: params.take,
    }),
    client.product.count({ where }),
  ]);
}

export function findProductById(id: string, client: Client = prisma) {
  return client.product.findUnique({ where: { id } });
}

export function findProductsByIds(ids: string[], client: Client = prisma) {
  return client.product.findMany({ where: { id: { in: ids } } });
}

// Unpaginated — used by the Stock Report, which lists every active product's
// current stock in one view rather than paging through them.
export function findAllActiveProducts(client: Client = prisma) {
  return client.product.findMany({ where: { active: true }, orderBy: { name: "asc" } });
}

export type ProductUpdateData = {
  name: string;
  unit: string;
  mrp: number;
  sellingPrice: number;
  minStockLevel: number;
};

export type ProductCreateData = ProductUpdateData & { sku: string };

export function createProduct(data: ProductCreateData, client: Client = prisma) {
  return client.product.create({ data });
}

// The SKU is generated once at creation and never edited, so it's not part of
// the update data.
export function updateProduct(id: string, data: ProductUpdateData, client: Client = prisma) {
  return client.product.update({ where: { id }, data });
}

export function setProductActive(id: string, active: boolean, client: Client = prisma) {
  return client.product.update({ where: { id }, data: { active } });
}

export function adjustCurrentStock(id: string, delta: number, client: Client = prisma) {
  return client.product.update({
    where: { id },
    data: { currentStock: { increment: delta } },
  });
}
