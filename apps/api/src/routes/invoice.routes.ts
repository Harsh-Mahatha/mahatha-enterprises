import { Router } from "express";
import { createInvoiceSchema, listInvoicesQuerySchema } from "@mahatha/validation";
import * as invoiceController from "../controllers/invoice.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";

export const invoiceRouter = Router();

invoiceRouter.use(requireAuth);

invoiceRouter.get("/", validateQuery(listInvoicesQuerySchema), invoiceController.listInvoices);
invoiceRouter.post("/", validateBody(createInvoiceSchema), invoiceController.createInvoice);
invoiceRouter.get("/:id", invoiceController.getInvoice);
