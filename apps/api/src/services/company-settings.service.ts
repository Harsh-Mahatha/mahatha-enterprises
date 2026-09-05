import type { UpdateCompanySettingsInput } from "@mahatha/validation";
import * as companySettingsRepository from "../repositories/company-settings.repository";

export async function getCompanySettings() {
  const existing = await companySettingsRepository.findCompanySettings();
  if (existing) {
    return existing;
  }
  return companySettingsRepository.createDefaultCompanySettings();
}

export async function updateCompanySettings(input: UpdateCompanySettingsInput) {
  const current = await getCompanySettings();
  return companySettingsRepository.updateCompanySettings(current.id, {
    businessName: input.businessName,
    address: input.address ?? null,
    phone: input.phone ?? null,
    email: input.email ?? null,
    logoUrl: input.logoUrl ?? null,
    invoicePrefix: input.invoicePrefix,
  });
}
