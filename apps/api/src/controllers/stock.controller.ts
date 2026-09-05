import type { Request, Response } from "express";
import type { ListStockMovementsQuery, StockAdjustmentInput, StockEntryInput } from "@mahatha/validation";
import * as stockService from "../services/stock.service";

export async function listStockMovements(_req: Request, res: Response) {
  const query = res.locals.query as ListStockMovementsQuery;
  const result = await stockService.listStockMovements(query);
  res.json({ success: true, data: result });
}

export async function createStockEntry(req: Request, res: Response) {
  const input = req.body as StockEntryInput;
  const product = await stockService.createStockEntry(input);
  res.status(201).json({ success: true, data: product });
}

export async function createStockAdjustment(req: Request, res: Response) {
  const input = req.body as StockAdjustmentInput;
  const product = await stockService.createStockAdjustment(input);
  res.status(201).json({ success: true, data: product });
}
