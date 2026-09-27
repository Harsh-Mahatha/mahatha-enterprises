import type { UpdateCompanySettingsInput } from "@mahatha/validation";
import * as companySettingsRepository from "../repositories/company-settings.repository";
import { TtlCache } from "../utils/ttl-cache";

type CompanySettings = Awaited<ReturnType<typeof companySettingsRepository.updateCompanySettings>>;

// Read on every invoice create and every print, but only changed from the
// Settings page — so it's cached, and refreshed on update.
const SETTINGS_CACHE_TTL_MS = 5 * 60_000;
const settingsCache = new TtlCache<"settings", CompanySettings>(SETTINGS_CACHE_TTL_MS);

export async function getCompanySettings() {
  const cached = settingsCache.get("settings");
  if (cached) {
    return cached;
  }
  const settings =
    (await companySettingsRepository.findCompanySettings()) ??
    (await companySettingsRepository.createDefaultCompanySettings());
  settingsCache.set("settings", settings);
  return settings;
}

export async function updateCompanySettings(input: UpdateCompanySettingsInput) {
  const current = await getCompanySettings();
  settingsCache.clear();
  const updated = await companySettingsRepository.updateCompanySettings(current.id, {
    businessName: input.businessName,
    address: input.address ?? null,
    phone: input.phone ?? null,
    email: input.email ?? null,
    logoUrl: input.logoUrl ?? null,
    invoicePrefix: input.invoicePrefix,
  });
  settingsCache.set("settings", updated);
  return updated;
}
