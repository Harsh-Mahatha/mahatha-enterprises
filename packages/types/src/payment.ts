import type { Customer } from "./customer";

export type PaymentMode = "CASH" | "UPI" | "BANK" | "OTHER";

export type Payment = {
  id: string;
  customerId: string;
  customer?: Customer;
  invoiceId: string | null;
  amount: string;
  mode: PaymentMode;
  reference: string | null;
  notes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
};
