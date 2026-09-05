import { Router } from "express";
import { salesReportQuerySchema, stockMovementReportQuerySchema } from "@mahatha/validation";
import * as reportsController from "../controllers/reports.controller";
import { requireAuth } from "../middleware/auth";
import { validateQuery } from "../middleware/validate";

export const reportsRouter = Router();

reportsRouter.use(requireAuth);

reportsRouter.get("/sales", validateQuery(salesReportQuerySchema), reportsController.getSalesReport);
reportsRouter.get("/outstanding", reportsController.getOutstandingReport);
reportsRouter.get("/stock", reportsController.getStockReport);
reportsRouter.get(
  "/stock-movements",
  validateQuery(stockMovementReportQuerySchema),
  reportsController.getStockMovementReport,
);
