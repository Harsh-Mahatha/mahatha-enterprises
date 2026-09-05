"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { StockReportItem } from "@mahatha/types";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { ReportSummary } from "@/features/reports";
import * as reportsService from "@/services/api/reports";

const columns: DataTableColumn<StockReportItem>[] = [
  { id: "name", header: "Product", cell: (row) => row.name },
  { id: "sku", header: "SKU", cell: (row) => row.sku },
  { id: "unit", header: "Unit", cell: (row) => row.unit },
  {
    id: "currentStock",
    header: "Current stock",
    cell: (row) => <span className="tabular-nums">{row.currentStock}</span>,
    className: "text-right",
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => <Badge variant={row.lowStock ? "warning" : "success"}>{row.lowStock ? "Low stock" : "In stock"}</Badge>,
  },
];

export default function StockReportPage() {
  const router = useRouter();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["reports", "stock"],
    queryFn: reportsService.getStockReport,
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Stock report" description="Current stock for every active product." />

      {error ? (
        <ErrorState description="Could not load the stock report." onRetry={() => refetch()} />
      ) : data ? (
        <div className="flex flex-col gap-4">
          <ReportSummary
            items={[
              { label: "Products", value: data.summary.totalProducts },
              { label: "Low stock", value: data.summary.lowStockCount },
            ]}
          />
          <DataTable
            columns={columns}
            data={data.items}
            rowKey={(row) => row.id}
            loading={isLoading}
            onRowClick={(row) => router.push(`/products/${row.id}`)}
          />
        </div>
      ) : null}
    </div>
  );
}
