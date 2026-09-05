import type { CustomerLedgerEntry, LedgerEntryType } from "@mahatha/types";
import { Badge } from "@/components/ui/Badge";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DateDisplay } from "@/components/ui/DateDisplay";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";

export type LedgerTableProps = {
  entries: CustomerLedgerEntry[];
  loading?: boolean;
};

const typeLabel: Record<LedgerEntryType, string> = {
  OPENING_BALANCE: "Opening balance",
  INVOICE: "Invoice",
  PAYMENT: "Payment",
};

const typeVariant: Record<LedgerEntryType, "default" | "info" | "success"> = {
  OPENING_BALANCE: "default",
  INVOICE: "info",
  PAYMENT: "success",
};

const columns: DataTableColumn<CustomerLedgerEntry>[] = [
  { id: "date", header: "Date", cell: (row) => <DateDisplay value={row.date} /> },
  {
    id: "type",
    header: "Type",
    cell: (row) => <Badge variant={typeVariant[row.type]}>{typeLabel[row.type]}</Badge>,
  },
  { id: "notes", header: "Notes", cell: (row) => row.notes ?? "—" },
  {
    id: "amount",
    header: "Amount",
    cell: (row) => {
      const value = Number(row.amount);
      return (
        <span className="tabular-nums">
          {value > 0 ? "+" : ""}
          <CurrencyDisplay value={value} />
        </span>
      );
    },
    className: "text-right",
  },
  {
    id: "balanceAfter",
    header: "Running balance",
    cell: (row) => <CurrencyDisplay value={Number(row.balanceAfter)} className="font-medium tabular-nums" />,
    className: "text-right",
  },
];

export function LedgerTable({ entries, loading }: LedgerTableProps) {
  return (
    <DataTable columns={columns} data={entries} rowKey={(row) => row.id} loading={loading} emptyTitle="No ledger entries yet." />
  );
}
