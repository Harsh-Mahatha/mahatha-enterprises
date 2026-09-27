import type { PaginationMeta } from "./api-response";
import type { Invoice } from "./invoice";
import type { StockMovement } from "./stock-movement";

export type SalesReportResult = {
  items: Invoice[];
  summary: {
    totalInvoices: number;
    totalSales: string;
    totalOutstanding: string;
  };
  meta: PaginationMeta;
};

export type OutstandingReportItem = {
  customerId: string;
  customerName: string;
  outstanding: string;
};

export type OutstandingReportResult = {
  items: OutstandingReportItem[];
  summary: {
    totalCustomers: number;
    totalOutstanding: string;
  };
};

export type StockReportItem = {
  id: string;
  name: string;
  sku: string;
  unit: string;
  currentStock: string;
  minStockLevel: number;
  lowStock: boolean;
};

export type StockReportResult = {
  items: StockReportItem[];
  summary: {
    totalProducts: number;
    lowStockCount: number;
  };
};

export type StockMovementReportResult = {
  items: StockMovement[];
  meta: PaginationMeta;
};
