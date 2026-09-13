import type { CreateInvoiceInput, Invoice, InvoiceStatus, PaginatedData, UpdateInvoiceInput } from "@mahatha/types";
import { apiRequest, buildQuery } from "./client";

export type ListInvoicesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  customerId?: string;
  status?: InvoiceStatus;
};

export function listInvoices(params: ListInvoicesParams = {}) {
  return apiRequest<PaginatedData<Invoice>>(`/api/invoices${buildQuery(params)}`);
}

export function getInvoice(id: string) {
  return apiRequest<Invoice>(`/api/invoices/${id}`);
}

export function createInvoice(input: CreateInvoiceInput) {
  return apiRequest<Invoice>("/api/invoices", { method: "POST", body: input });
}

export function updateInvoice(id: string, input: UpdateInvoiceInput) {
  return apiRequest<Invoice>(`/api/invoices/${id}`, { method: "PATCH", body: input });
}
