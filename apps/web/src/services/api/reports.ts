import type {
  OutstandingReportResult,
  SalesReportResult,
  StockMovementReportResult,
  StockReportResult,
} from "@mahatha/types";
import { apiRequest, buildQuery } from "./client";

export type SalesReportParams = {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  customerId?: string;
};

export function getSalesReport(params: SalesReportParams = {}) {
  return apiRequest<SalesReportResult>(`/api/reports/sales${buildQuery(params)}`);
}

export function getOutstandingReport() {
  return apiRequest<OutstandingReportResult>("/api/reports/outstanding");
}

export function getStockReport() {
  return apiRequest<StockReportResult>("/api/reports/stock");
}

export type StockMovementReportParams = {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  productId?: string;
};

export function getStockMovementReport(params: StockMovementReportParams = {}) {
  return apiRequest<StockMovementReportResult>(`/api/reports/stock-movements${buildQuery(params)}`);
}
