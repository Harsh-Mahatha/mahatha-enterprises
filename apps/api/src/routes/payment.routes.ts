import { Router } from "express";
import { createPaymentSchema, listPaymentsQuerySchema } from "@mahatha/validation";
import * as paymentController from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";

export const paymentRouter = Router();

paymentRouter.use(requireAuth);

paymentRouter.get("/", validateQuery(listPaymentsQuerySchema), paymentController.listPayments);
paymentRouter.post("/", validateBody(createPaymentSchema), paymentController.createPayment);
paymentRouter.get("/:id", paymentController.getPayment);
