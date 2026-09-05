import { Router } from "express";
import { createInvoiceSchema, idParamSchema, listInvoicesQuerySchema } from "@mahatha/validation";
import * as invoiceController from "../controllers/invoice.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateParams, validateQuery } from "../middleware/validate";

export const invoiceRouter = Router();

invoiceRouter.use(requireAuth);

invoiceRouter.get("/", validateQuery(listInvoicesQuerySchema), invoiceController.listInvoices);
invoiceRouter.post("/", validateBody(createInvoiceSchema), invoiceController.createInvoice);
invoiceRouter.get("/:id", validateParams(idParamSchema), invoiceController.getInvoice);
