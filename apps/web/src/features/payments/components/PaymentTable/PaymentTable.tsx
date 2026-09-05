"use client";

import { useRouter } from "next/navigation";
import type { Payment, PaymentMode } from "@mahatha/types";
import { Badge } from "@/components/ui/Badge";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DateDisplay } from "@/components/ui/DateDisplay";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";

export type PaymentTableProps = {
  payments: Payment[];
  loading?: boolean;
  showCustomer?: boolean;
};

const modeLabel: Record<PaymentMode, string> = {
  CASH: "Cash",
  UPI: "UPI",
  BANK: "Bank",
  OTHER: "Other",
};

function buildColumns(showCustomer: boolean): DataTableColumn<Payment>[] {
  const columns: DataTableColumn<Payment>[] = [
    { id: "date", header: "Date", cell: (row) => <DateDisplay value={row.date} /> },
  ];

  if (showCustomer) {
    columns.push({ id: "customer", header: "Customer", cell: (row) => row.customer?.name ?? "—" });
  }

  columns.push(
    {
      id: "amount",
      header: "Amount",
      cell: (row) => <CurrencyDisplay value={Number(row.amount)} />,
      className: "text-right",
    },
    { id: "mode", header: "Mode", cell: (row) => <Badge variant="outline">{modeLabel[row.mode]}</Badge> },
    { id: "reference", header: "Reference", cell: (row) => row.reference ?? "—" },
  );

  return columns;
}

export function PaymentTable({ payments, loading, showCustomer = true }: PaymentTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={buildColumns(showCustomer)}
      data={payments}
      rowKey={(row) => row.id}
      loading={loading}
      emptyTitle="No payments yet."
      onRowClick={(row) => router.push(`/payments/${row.id}`)}
    />
  );
}
