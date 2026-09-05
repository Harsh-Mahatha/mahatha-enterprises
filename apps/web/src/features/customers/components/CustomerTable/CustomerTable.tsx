"use client";

import { useRouter } from "next/navigation";
import type { Customer } from "@mahatha/types";
import { Badge } from "@/components/ui/Badge";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";

export type CustomerTableProps = {
  customers: Customer[];
  loading?: boolean;
};

const columns: DataTableColumn<Customer>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
  { id: "phone", header: "Phone", cell: (row) => row.phone ?? "—" },
  { id: "email", header: "Email", cell: (row) => row.email ?? "—" },
  {
    id: "openingBalance",
    header: "Opening balance",
    cell: (row) => <CurrencyDisplay value={Number(row.openingBalance)} />,
    className: "text-right",
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <Badge variant={row.active ? "success" : "default"}>{row.active ? "Active" : "Inactive"}</Badge>
    ),
  },
];

export function CustomerTable({ customers, loading }: CustomerTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={columns}
      data={customers}
      rowKey={(row) => row.id}
      loading={loading}
      emptyTitle="No customers yet."
      emptyDescription="Add your first customer to get started."
      onRowClick={(row) => router.push(`/customers/${row.id}`)}
    />
  );
}
