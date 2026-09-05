import type { PaginatedData, Payment, PaymentMode } from "@mahatha/types";
import { apiRequest, buildQuery } from "./client";

export type ListPaymentsParams = {
  page?: number;
  pageSize?: number;
  customerId?: string;
};

export type CreatePaymentInput = {
  customerId: string;
  amount: number;
  mode: PaymentMode;
  date: string;
  reference?: string;
  notes?: string;
};

export function listPayments(params: ListPaymentsParams = {}) {
  return apiRequest<PaginatedData<Payment>>(`/api/payments${buildQuery(params)}`);
}

export function getPayment(id: string) {
  return apiRequest<Payment>(`/api/payments/${id}`);
}

export function createPayment(input: CreatePaymentInput) {
  return apiRequest<Payment>("/api/payments", { method: "POST", body: input });
}
