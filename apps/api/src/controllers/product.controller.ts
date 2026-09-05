import type { Request, Response } from "express";
import type { CreateProductInput, ListProductsQuery, SetProductActiveInput, UpdateProductInput } from "@mahatha/validation";
import * as productService from "../services/product.service";

type IdParams = { id: string };

export async function listProducts(_req: Request, res: Response) {
  const query = res.locals.query as ListProductsQuery;
  const result = await productService.listProducts(query);
  res.json({ success: true, data: result });
}

export async function getProduct(req: Request<IdParams>, res: Response) {
  const product = await productService.getProduct(req.params.id);
  res.json({ success: true, data: product });
}

export async function createProduct(req: Request, res: Response) {
  const input = req.body as CreateProductInput;
  const product = await productService.createProduct(input);
  res.status(201).json({ success: true, data: product });
}

export async function updateProduct(req: Request<IdParams>, res: Response) {
  const input = req.body as UpdateProductInput;
  const product = await productService.updateProduct(req.params.id, input);
  res.json({ success: true, data: product });
}

export async function setProductActive(req: Request<IdParams>, res: Response) {
  const { active } = req.body as SetProductActiveInput;
  const product = await productService.setProductActive(req.params.id, active);
  res.json({ success: true, data: product });
}
