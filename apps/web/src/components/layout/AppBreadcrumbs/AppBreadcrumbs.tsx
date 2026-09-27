"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import * as customerService from "@/services/api/customers";
import * as invoiceService from "@/services/api/invoices";
import * as paymentService from "@/services/api/payments";
import * as productService from "@/services/api/products";

// Labels for static path segments. Keyed by the full path where the same
// segment means different things under different sections (e.g. "new").
const PATH_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/customers": "Customers",
  "/customers/new": "Add customer",
  "/products": "Products",
  "/products/new": "Add product",
  "/inventory": "Inventory",
  "/inventory/entry": "Stock entry",
  "/inventory/adjustment": "Stock adjustment",
  "/invoices": "Invoices",
  "/invoices/new": "Create invoice",
  "/payments": "Payments",
  "/payments/new": "Record payment",
  "/reports": "Reports",
  "/reports/sales": "Sales",
  "/reports/outstanding": "Outstanding",
  "/reports/stock": "Stock",
  "/reports/stock-movements": "Stock movements",
  "/settings": "Settings",
  "/settings/change-password": "Change password",
  "/style-guide": "Style Guide",
};

const SEGMENT_LABELS: Record<string, string> = {
  edit: "Edit",
  ledger: "Ledger",
};

// Sections whose second segment is a record id. The query keys and fetchers
// match the ones the detail pages use, so the name comes from the same cached
// request rather than a second fetch.
const RECORD_FETCHERS = {
  customers: customerService.getCustomer,
  products: productService.getProduct,
  invoices: invoiceService.getInvoice,
  payments: paymentService.getPayment,
} as const;

type RecordSection = keyof typeof RECORD_FETCHERS;
type SectionRecord = Awaited<ReturnType<(typeof RECORD_FETCHERS)[RecordSection]>>;

function isRecordSection(section: string | undefined): section is RecordSection {
  return section !== undefined && section in RECORD_FETCHERS;
}

function getRecordLabel(record: SectionRecord) {
  if ("invoiceNumber" in record) return record.invoiceNumber;
  if ("name" in record) return record.name;
  return "Payment details";
}

function humanize(segment: string) {
  const text = segment.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function AppBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const section = segments[0];
  const recordId =
    isRecordSection(section) && segments[1] && !PATH_LABELS[`/${section}/${segments[1]}`] ? segments[1] : undefined;

  const { data: recordLabel } = useQuery<SectionRecord, Error, string>({
    queryKey: [section, recordId],
    queryFn: () => RECORD_FETCHERS[section as RecordSection](recordId!),
    select: getRecordLabel,
    enabled: recordId !== undefined,
  });

  const items: BreadcrumbItem[] = [];
  if (section !== "dashboard") {
    items.push({ label: "Home", href: "/dashboard" });
  }

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    let label = PATH_LABELS[href] ?? SEGMENT_LABELS[segment] ?? humanize(segment);
    if (index === 1 && recordId !== undefined) {
      label = recordLabel ?? "…";
    }
    items.push({ label, href });
  });

  return <Breadcrumbs items={items} />;
}
