import { Router } from "express";
import {
  createProductSchema,
  idParamSchema,
  listProductsQuerySchema,
  setProductActiveSchema,
  updateProductSchema,
} from "@mahatha/validation";
import * as productController from "../controllers/product.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateParams, validateQuery } from "../middleware/validate";

export const productRouter = Router();

productRouter.use(requireAuth);

productRouter.get("/", validateQuery(listProductsQuerySchema), productController.listProducts);
productRouter.post("/", validateBody(createProductSchema), productController.createProduct);
productRouter.get("/:id", validateParams(idParamSchema), productController.getProduct);
productRouter.patch(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateProductSchema),
  productController.updateProduct,
);
productRouter.patch(
  "/:id/status",
  validateParams(idParamSchema),
  validateBody(setProductActiveSchema),
  productController.setProductActive,
);
