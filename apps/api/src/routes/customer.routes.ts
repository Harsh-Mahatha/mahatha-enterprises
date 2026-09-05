import { Router } from "express";
import { createCustomerSchema, listCustomersQuerySchema, setCustomerActiveSchema, updateCustomerSchema } from "@mahatha/validation";
import * as customerController from "../controllers/customer.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";

export const customerRouter = Router();

customerRouter.use(requireAuth);

customerRouter.get("/", validateQuery(listCustomersQuerySchema), customerController.listCustomers);
customerRouter.post("/", validateBody(createCustomerSchema), customerController.createCustomer);
customerRouter.get("/:id", customerController.getCustomer);
customerRouter.patch("/:id", validateBody(updateCustomerSchema), customerController.updateCustomer);
customerRouter.patch("/:id/status", validateBody(setCustomerActiveSchema), customerController.setCustomerActive);
