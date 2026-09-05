import type { Invoice } from "./invoice";

export type DashboardSummary = {
  todaysSales: string;
  todaysInvoiceCount: number;
  outstanding: string;
  totalCustomers: number;
  lowStockCount: number;
  recentInvoices: Invoice[];
};
