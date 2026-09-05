import { Router } from "express";
import {
  createCustomerSchema,
  idParamSchema,
  listCustomersQuerySchema,
  paginationQuerySchema,
  setCustomerActiveSchema,
  updateCustomerSchema,
} from "@mahatha/validation";
import * as customerController from "../controllers/customer.controller";
import * as ledgerController from "../controllers/ledger.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateParams, validateQuery } from "../middleware/validate";

export const customerRouter = Router();

customerRouter.use(requireAuth);

customerRouter.get("/", validateQuery(listCustomersQuerySchema), customerController.listCustomers);
customerRouter.post("/", validateBody(createCustomerSchema), customerController.createCustomer);
customerRouter.get("/:id", validateParams(idParamSchema), customerController.getCustomer);
customerRouter.patch(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateCustomerSchema),
  customerController.updateCustomer,
);
customerRouter.patch(
  "/:id/status",
  validateParams(idParamSchema),
  validateBody(setCustomerActiveSchema),
  customerController.setCustomerActive,
);
customerRouter.get(
  "/:id/ledger",
  validateParams(idParamSchema),
  validateQuery(paginationQuerySchema),
  ledgerController.getCustomerLedger,
);
