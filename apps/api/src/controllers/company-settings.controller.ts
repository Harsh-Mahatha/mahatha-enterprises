import type { Request, Response } from "express";
import type { UpdateCompanySettingsInput } from "@mahatha/validation";
import * as companySettingsService from "../services/company-settings.service";

export async function getSettings(_req: Request, res: Response) {
  const settings = await companySettingsService.getCompanySettings();
  res.json({ success: true, data: settings });
}

export async function updateSettings(req: Request, res: Response) {
  const input = req.body as UpdateCompanySettingsInput;
  const settings = await companySettingsService.updateCompanySettings(input);
  res.json({ success: true, data: settings });
}
