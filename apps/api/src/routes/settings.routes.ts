import { Router } from "express";
import { updateCompanySettingsSchema } from "@mahatha/validation";
import * as companySettingsController from "../controllers/company-settings.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";

export const settingsRouter = Router();

settingsRouter.get("/", requireAuth, companySettingsController.getSettings);
settingsRouter.patch(
  "/",
  requireAuth,
  validateBody(updateCompanySettingsSchema),
  companySettingsController.updateSettings,
);
