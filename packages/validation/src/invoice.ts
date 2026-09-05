import { z } from "zod";
import { optionalText } from "./common";
import { paginationQuerySchema } from "./pagination";
import { paymentModeSchema } from "./payment";

export const invoiceItemInputSchema = z.object({
  productId: z.string().uuid("Select a product."),
  quantity: z.coerce.number().positive("Quantity must be greater than zero."),
  unitPrice: z.coerce.number().nonnegative("Price cannot be negative."),
});
export type InvoiceItemInput = z.infer<typeof invoiceItemInputSchema>;

export const invoiceDiscountInputSchema = z.object({
  description: optionalText(200),
  amount: z.coerce.number().positive("Discount amount must be greater than zero."),
});
export type InvoiceDiscountInput = z.infer<typeof invoiceDiscountInputSchema>;

export const createInvoiceSchema = z
  .object({
    customerId: z.string().uuid("Select a customer."),
    date: z.coerce.date(),
    items: z.array(invoiceItemInputSchema).min(1, "Add at least one item."),
    discounts: z.array(invoiceDiscountInputSchema).default([]),
    paymentReceived: z.coerce.number().nonnegative().default(0),
    paymentMode: paymentModeSchema.optional(),
    notes: optionalText(1000),
  })
  .refine((data) => data.paymentReceived <= 0 || data.paymentMode !== undefined, {
    message: "Select a payment mode.",
    path: ["paymentMode"],
  });
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

export const invoiceStatusValues = ["PAID", "PARTIAL", "UNPAID"] as const;
export const invoiceStatusSchema = z.enum(invoiceStatusValues);

export const listInvoicesQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(200).optional(),
  customerId: z.string().uuid().optional(),
  status: invoiceStatusSchema.optional(),
});
export type ListInvoicesQuery = z.infer<typeof listInvoicesQuerySchema>;
