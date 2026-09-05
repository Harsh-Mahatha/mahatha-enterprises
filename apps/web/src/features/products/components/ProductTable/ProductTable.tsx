"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@mahatha/types";
import { Badge } from "@/components/ui/Badge";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { getStockStatus, stockStatusLabel, stockStatusVariant } from "@/features/products/utils/stock-status";

export type ProductTableProps = {
  products: Product[];
  loading?: boolean;
};

const columns: DataTableColumn<Product>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
  { id: "sku", header: "SKU", cell: (row) => row.sku },
  { id: "unit", header: "Unit", cell: (row) => row.unit },
  {
    id: "sellingPrice",
    header: "Selling price",
    cell: (row) => <CurrencyDisplay value={Number(row.sellingPrice)} />,
    className: "text-right",
  },
  {
    id: "stock",
    header: "Current stock",
    cell: (row) => {
      const status = getStockStatus(Number(row.currentStock), row.minStockLevel);
      return (
        <div className="flex items-center gap-2">
          <span className="tabular-nums">{row.currentStock}</span>
          <Badge variant={stockStatusVariant[status]}>{stockStatusLabel[status]}</Badge>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => <Badge variant={row.active ? "success" : "default"}>{row.active ? "Active" : "Inactive"}</Badge>,
  },
];

export function ProductTable({ products, loading }: ProductTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={columns}
      data={products}
      rowKey={(row) => row.id}
      loading={loading}
      emptyTitle="No products yet."
      emptyDescription="Add your first product to get started."
      onRowClick={(row) => router.push(`/products/${row.id}`)}
    />
  );
}
