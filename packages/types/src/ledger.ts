import type { PaginationMeta } from "./api-response";
import type { Customer } from "./customer";

export type LedgerEntryType = "OPENING_BALANCE" | "INVOICE" | "PAYMENT";

export type CustomerLedgerEntry = {
  id: string;
  customerId: string;
  type: LedgerEntryType;
  amount: string;
  balanceAfter: string;
  invoiceId: string | null;
  paymentId: string | null;
  date: string;
  notes: string | null;
  createdAt: string;
};

export type CustomerLedgerResult = {
  customer: Customer;
  outstanding: number;
  items: CustomerLedgerEntry[];
  meta: PaginationMeta;
};
