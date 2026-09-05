import { z } from "zod";
import { optionalText } from "./common";
import { paginationQuerySchema } from "./pagination";

export const paymentModeValues = ["CASH", "UPI", "BANK", "OTHER"] as const;
export const paymentModeSchema = z.enum(paymentModeValues);

export const createPaymentSchema = z.object({
  customerId: z.string().uuid("Select a customer."),
  amount: z.coerce.number().positive("Amount must be greater than zero."),
  mode: paymentModeSchema,
  date: z.coerce.date(),
  reference: optionalText(100),
  notes: optionalText(1000),
});
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export const listPaymentsQuerySchema = paginationQuerySchema.extend({
  customerId: z.string().uuid().optional(),
});
export type ListPaymentsQuery = z.infer<typeof listPaymentsQuerySchema>;
