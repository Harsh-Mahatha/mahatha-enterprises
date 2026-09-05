import type { CustomerLedgerResult } from "@mahatha/types";
import { apiRequest, buildQuery } from "./client";

export type GetCustomerLedgerParams = {
  page?: number;
  pageSize?: number;
};

export function getCustomerLedger(customerId: string, params: GetCustomerLedgerParams = {}) {
  return apiRequest<CustomerLedgerResult>(`/api/customers/${customerId}/ledger${buildQuery(params)}`);
}
