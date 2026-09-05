import { Router } from "express";
import { createPaymentSchema, idParamSchema, listPaymentsQuerySchema } from "@mahatha/validation";
import * as paymentController from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateParams, validateQuery } from "../middleware/validate";

export const paymentRouter = Router();

paymentRouter.use(requireAuth);

paymentRouter.get("/", validateQuery(listPaymentsQuerySchema), paymentController.listPayments);
paymentRouter.post("/", validateBody(createPaymentSchema), paymentController.createPayment);
paymentRouter.get("/:id", validateParams(idParamSchema), paymentController.getPayment);
