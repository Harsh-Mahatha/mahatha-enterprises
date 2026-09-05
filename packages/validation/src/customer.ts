import { z } from "zod";
import { optionalEmail, optionalText } from "./common";
import { paginationQuerySchema } from "./pagination";

export const createCustomerSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  phone: optionalText(30),
  email: optionalEmail(),
  address: optionalText(500),
  openingBalance: z.coerce.number().finite().default(0),
});
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  phone: optionalText(30),
  email: optionalEmail(),
  address: optionalText(500),
});
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

export const setCustomerActiveSchema = z.object({
  active: z.boolean(),
});
export type SetCustomerActiveInput = z.infer<typeof setCustomerActiveSchema>;

export const listCustomersQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(200).optional(),
});
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
