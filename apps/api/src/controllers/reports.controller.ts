import type { Request, Response } from "express";
import type { SalesReportQuery, StockMovementReportQuery } from "@mahatha/validation";
import * as reportsService from "../services/reports.service";

export async function getSalesReport(_req: Request, res: Response) {
  const query = res.locals.query as SalesReportQuery;
  const result = await reportsService.getSalesReport(query);
  res.json({ success: true, data: result });
}

export async function getOutstandingReport(_req: Request, res: Response) {
  const result = await reportsService.getOutstandingReport();
  res.json({ success: true, data: result });
}

export async function getStockReport(_req: Request, res: Response) {
  const result = await reportsService.getStockReport();
  res.json({ success: true, data: result });
}

export async function getStockMovementReport(_req: Request, res: Response) {
  const query = res.locals.query as StockMovementReportQuery;
  const result = await reportsService.getStockMovementReport(query);
  res.json({ success: true, data: result });
}
