import { z } from "zod";
import { optionalEmail, optionalText, optionalUrl } from "./common";

export const updateCompanySettingsSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required.").max(200),
  address: optionalText(500),
  phone: optionalText(30),
  email: optionalEmail(),
  logoUrl: optionalUrl(),
  invoicePrefix: z.string().trim().min(1, "Invoice prefix is required.").max(20),
});
export type UpdateCompanySettingsInput = z.infer<typeof updateCompanySettingsSchema>;
