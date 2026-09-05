import type { StockMovement, StockMovementType } from "@mahatha/types";
import { Badge } from "@/components/ui/Badge";
import { DateDisplay } from "@/components/ui/DateDisplay";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";

export type StockMovementTableProps = {
  movements: StockMovement[];
  loading?: boolean;
  showProduct?: boolean;
};

const movementTypeLabel: Record<StockMovementType, string> = {
  STOCK_ENTRY: "Stock entry",
  SALE: "Sale",
  ADJUSTMENT: "Adjustment",
};

const movementTypeVariant: Record<StockMovementType, "success" | "info" | "warning"> = {
  STOCK_ENTRY: "success",
  SALE: "info",
  ADJUSTMENT: "warning",
};

function buildColumns(showProduct: boolean): DataTableColumn<StockMovement>[] {
  const columns: DataTableColumn<StockMovement>[] = [
    { id: "date", header: "Date", cell: (row) => <DateDisplay value={row.date} /> },
  ];

  if (showProduct) {
    columns.push({ id: "product", header: "Product", cell: (row) => row.product?.name ?? "—" });
  }

  columns.push(
    {
      id: "type",
      header: "Type",
      cell: (row) => <Badge variant={movementTypeVariant[row.type]}>{movementTypeLabel[row.type]}</Badge>,
    },
    {
      id: "quantity",
      header: "Quantity",
      cell: (row) => {
        const value = Number(row.quantity);
        return (
          <span className={value < 0 ? "tabular-nums text-destructive" : "tabular-nums"}>
            {value > 0 ? `+${row.quantity}` : row.quantity}
          </span>
        );
      },
      className: "text-right",
    },
    { id: "reference", header: "Reference", cell: (row) => row.reason ?? "—" },
    { id: "notes", header: "Notes", cell: (row) => row.notes ?? "—" },
  );

  return columns;
}

export function StockMovementTable({ movements, loading, showProduct = true }: StockMovementTableProps) {
  return (
    <DataTable
      columns={buildColumns(showProduct)}
      data={movements}
      rowKey={(row) => row.id}
      loading={loading}
      emptyTitle="No stock movements yet."
    />
  );
}
