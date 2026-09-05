import { z } from "zod";
import { paginationQuerySchema } from "./pagination";

export const salesReportQuerySchema = paginationQuerySchema.extend({
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  customerId: z.string().uuid().optional(),
});
export type SalesReportQuery = z.infer<typeof salesReportQuerySchema>;

export const stockMovementReportQuerySchema = paginationQuerySchema.extend({
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  productId: z.string().uuid().optional(),
});
export type StockMovementReportQuery = z.infer<typeof stockMovementReportQuerySchema>;
