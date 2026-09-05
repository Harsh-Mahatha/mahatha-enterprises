import { z } from "zod";
import { optionalText } from "./common";
import { paginationQuerySchema } from "./pagination";

export const stockEntrySchema = z.object({
  productId: z.string().uuid("Select a product."),
  quantity: z.coerce.number().positive("Quantity must be greater than zero."),
  date: z.coerce.date(),
  reason: optionalText(200),
  notes: optionalText(1000),
});
export type StockEntryInput = z.infer<typeof stockEntrySchema>;

export const stockAdjustmentSchema = z.object({
  productId: z.string().uuid("Select a product."),
  actualStock: z.coerce.number().nonnegative("Actual stock cannot be negative."),
  reason: z.string().trim().min(1, "Reason is required.").max(200),
  notes: optionalText(1000),
});
export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;

export const listStockMovementsQuerySchema = paginationQuerySchema.extend({
  productId: z.string().uuid().optional(),
});
export type ListStockMovementsQuery = z.infer<typeof listStockMovementsQuerySchema>;
