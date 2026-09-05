import { Router } from "express";
import { listStockMovementsQuerySchema, stockAdjustmentSchema, stockEntrySchema } from "@mahatha/validation";
import * as stockController from "../controllers/stock.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";

export const inventoryRouter = Router();

inventoryRouter.use(requireAuth);

inventoryRouter.get("/movements", validateQuery(listStockMovementsQuerySchema), stockController.listStockMovements);
inventoryRouter.post("/entries", validateBody(stockEntrySchema), stockController.createStockEntry);
inventoryRouter.post("/adjustments", validateBody(stockAdjustmentSchema), stockController.createStockAdjustment);
