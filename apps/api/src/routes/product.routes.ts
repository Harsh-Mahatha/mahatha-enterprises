import { Router } from "express";
import {
  createProductSchema,
  listProductsQuerySchema,
  setProductActiveSchema,
  updateProductSchema,
} from "@mahatha/validation";
import * as productController from "../controllers/product.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";

export const productRouter = Router();

productRouter.use(requireAuth);

productRouter.get("/", validateQuery(listProductsQuerySchema), productController.listProducts);
productRouter.post("/", validateBody(createProductSchema), productController.createProduct);
productRouter.get("/:id", productController.getProduct);
productRouter.patch("/:id", validateBody(updateProductSchema), productController.updateProduct);
productRouter.patch("/:id/status", validateBody(setProductActiveSchema), productController.setProductActive);
