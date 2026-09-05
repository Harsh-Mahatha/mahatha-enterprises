import type { Customer, PaginatedData } from "@mahatha/types";
import { apiRequest, buildQuery } from "./client";

export type ListCustomersParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type CreateCustomerInput = {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  openingBalance?: number;
};

export type UpdateCustomerInput = {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
};

export function listCustomers(params: ListCustomersParams = {}) {
  return apiRequest<PaginatedData<Customer>>(`/api/customers${buildQuery(params)}`);
}

export function getCustomer(id: string) {
  return apiRequest<Customer>(`/api/customers/${id}`);
}

export function createCustomer(input: CreateCustomerInput) {
  return apiRequest<Customer>("/api/customers", { method: "POST", body: input });
}

export function updateCustomer(id: string, input: UpdateCustomerInput) {
  return apiRequest<Customer>(`/api/customers/${id}`, { method: "PATCH", body: input });
}

export function setCustomerActive(id: string, active: boolean) {
  return apiRequest<Customer>(`/api/customers/${id}/status`, { method: "PATCH", body: { active } });
}
