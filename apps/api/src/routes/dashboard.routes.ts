import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { requireAuth } from "../middleware/auth";

export const dashboardRouter = Router();

dashboardRouter.get("/", requireAuth, dashboardController.getDashboardSummary);
