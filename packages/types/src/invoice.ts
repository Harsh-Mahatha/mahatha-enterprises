import type { Customer } from "./customer";
import type { PaymentMode } from "./payment";
import type { Product } from "./product";

export type InvoiceStatus = "PAID" | "PARTIAL" | "UNPAID";

export type InvoiceItem = {
  id: string;
  invoiceId: string;
  productId: string;
  product?: Product;
  quantity: string;
  unitPrice: string;
  lineTotal: string;
  createdAt: string;
};

export type InvoiceDiscount = {
  id: string;
  invoiceId: string;
  description: string | null;
  amount: string;
  createdAt: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer?: Customer;
  date: string;
  subtotal: string;
  discountTotal: string;
  total: string;
  amountPaid: string;
  status: InvoiceStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items?: InvoiceItem[];
  discounts?: InvoiceDiscount[];
};

export type CreateInvoiceItemInput = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type CreateInvoiceDiscountInput = {
  description?: string;
  amount: number;
};

export type CreateInvoiceInput = {
  customerId: string;
  date: string;
  items: CreateInvoiceItemInput[];
  discounts: CreateInvoiceDiscountInput[];
  paymentReceived: number;
  paymentMode?: PaymentMode;
  notes?: string;
};

export type UpdateInvoiceInput = {
  date: string;
  items: CreateInvoiceItemInput[];
  discounts: CreateInvoiceDiscountInput[];
  notes?: string;
};
