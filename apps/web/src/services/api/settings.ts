import type { CompanySettings } from "@mahatha/types";
import { apiRequest } from "./client";

export type UpdateCompanySettingsInput = {
  businessName: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  invoicePrefix: string;
};

export function getCompanySettings() {
  return apiRequest<CompanySettings>("/api/settings");
}

export function updateCompanySettings(input: UpdateCompanySettingsInput) {
  return apiRequest<CompanySettings>("/api/settings", { method: "PATCH", body: input });
}
