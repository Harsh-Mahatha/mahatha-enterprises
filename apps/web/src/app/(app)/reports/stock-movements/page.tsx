"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/layout/PageHeader";
import { Toolbar } from "@/components/layout/Toolbar";
import { Pagination } from "@/components/tables/Pagination";
import { ProductSelect, StockMovementTable } from "@/features/inventory";
import { DateRangeFilter } from "@/features/reports";
import * as reportsService from "@/services/api/reports";

const PAGE_SIZE = 20;

export default function StockMovementReportPage() {
  const [dateRange, setDateRange] = useState({ dateFrom: "", dateTo: "" });
  const [productId, setProductId] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["reports", "stock-movements", { ...dateRange, productId, page }],
    queryFn: () =>
      reportsService.getStockMovementReport({
        dateFrom: dateRange.dateFrom || undefined,
        dateTo: dateRange.dateTo || undefined,
        productId: productId || undefined,
        page,
        pageSize: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Stock movement report" description="Every stock entry, sale, and adjustment over a date range." />

      <Toolbar>
        <DateRangeFilter
          value={dateRange}
          onChange={(value) => {
            setDateRange(value);
            setPage(1);
          }}
        />
        <div className="w-48">
          <ProductSelect
            value={productId}
            onValueChange={(value) => {
              setProductId(value);
              setPage(1);
            }}
            allowAllLabel="All products"
          />
        </div>
      </Toolbar>

      {error ? (
        <ErrorState description="Could not load stock movements." onRetry={() => refetch()} />
      ) : (
        <div className="flex flex-col gap-4">
          <StockMovementTable movements={data?.items ?? []} loading={isLoading} />
          {data ? (
            <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
          ) : null}
        </div>
      )}
    </div>
  );
}
