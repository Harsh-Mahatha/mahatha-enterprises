import { z } from "zod";
import { paginationQuerySchema } from "./pagination";

export const productUnitValues = ["PIECE", "BOX", "KG", "LITRE", "METER"] as const;
export const productUnitSchema = z.enum(productUnitValues);

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  sku: z.string().trim().min(1, "SKU is required.").max(50),
  unit: productUnitSchema,
  sellingPrice: z.coerce.number().finite().nonnegative("Selling price cannot be negative."),
  minStockLevel: z.coerce.number().int().nonnegative().default(0),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const setProductActiveSchema = z.object({
  active: z.boolean(),
});
export type SetProductActiveInput = z.infer<typeof setProductActiveSchema>;

export const listProductsQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(200).optional(),
});
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
