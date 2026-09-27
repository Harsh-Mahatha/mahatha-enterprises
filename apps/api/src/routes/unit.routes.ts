import { Router } from "express";
import { createUnitSchema } from "@mahatha/validation";
import * as unitController from "../controllers/unit.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";

export const unitRouter = Router();

unitRouter.use(requireAuth);

unitRouter.get("/", unitController.listUnits);
unitRouter.post("/", validateBody(createUnitSchema), unitController.createUnit);
