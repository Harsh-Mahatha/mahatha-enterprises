"use client";

import { useRouter } from "next/navigation";
import type { Invoice, InvoiceStatus } from "@mahatha/types";
import { Badge } from "@/components/ui/Badge";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DateDisplay } from "@/components/ui/DateDisplay";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";

export type InvoiceTableProps = {
  invoices: Invoice[];
  loading?: boolean;
};

const statusVariant: Record<InvoiceStatus, "success" | "warning" | "error"> = {
  PAID: "success",
  PARTIAL: "warning",
  UNPAID: "error",
};

const columns: DataTableColumn<Invoice>[] = [
  { id: "invoiceNumber", header: "Invoice", cell: (row) => row.invoiceNumber },
  { id: "customer", header: "Customer", cell: (row) => row.customer?.name ?? "—" },
  { id: "date", header: "Date", cell: (row) => <DateDisplay value={row.date} /> },
  {
    id: "total",
    header: "Total",
    cell: (row) => <CurrencyDisplay value={Number(row.total)} />,
    className: "text-right",
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
  },
];

export function InvoiceTable({ invoices, loading }: InvoiceTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={columns}
      data={invoices}
      rowKey={(row) => row.id}
      loading={loading}
      emptyTitle="No invoices yet."
      emptyDescription="Create your first invoice to get started."
      onRowClick={(row) => router.push(`/invoices/${row.id}`)}
    />
  );
}
