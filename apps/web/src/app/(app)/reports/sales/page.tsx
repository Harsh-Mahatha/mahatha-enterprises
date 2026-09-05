"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getInvoiceOutstanding } from "@mahatha/calculations";
import type { Invoice, InvoiceStatus } from "@mahatha/types";
import { Badge } from "@/components/ui/Badge";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DateDisplay } from "@/components/ui/DateDisplay";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/layout/PageHeader";
import { Toolbar } from "@/components/layout/Toolbar";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { Pagination } from "@/components/tables/Pagination";
import { CustomerSelect } from "@/features/customers";
import { DateRangeFilter, ReportSummary } from "@/features/reports";
import * as reportsService from "@/services/api/reports";

const PAGE_SIZE = 20;

const statusVariant: Record<InvoiceStatus, "success" | "warning" | "error"> = {
  PAID: "success",
  PARTIAL: "warning",
  UNPAID: "error",
};

const columns: DataTableColumn<Invoice>[] = [
  { id: "invoiceNumber", header: "Invoice", cell: (row) => row.invoiceNumber },
  { id: "customer", header: "Customer", cell: (row) => row.customer?.name ?? "—" },
  { id: "date", header: "Date", cell: (row) => <DateDisplay value={row.date} /> },
  { id: "total", header: "Total", cell: (row) => <CurrencyDisplay value={Number(row.total)} />, className: "text-right" },
  {
    id: "amountPaid",
    header: "Amount paid",
    cell: (row) => <CurrencyDisplay value={Number(row.amountPaid)} />,
    className: "text-right",
  },
  {
    id: "outstanding",
    header: "Outstanding",
    cell: (row) => <CurrencyDisplay value={Number(getInvoiceOutstanding(row))} />,
    className: "text-right",
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
  },
];

export default function SalesReportPage() {
  const [dateRange, setDateRange] = useState({ dateFrom: "", dateTo: "" });
  const [customerId, setCustomerId] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["reports", "sales", { ...dateRange, customerId, page }],
    queryFn: () =>
      reportsService.getSalesReport({
        dateFrom: dateRange.dateFrom || undefined,
        dateTo: dateRange.dateTo || undefined,
        customerId: customerId || undefined,
        page,
        pageSize: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Sales report" description="Invoices over a date range, filterable by customer." />

      <Toolbar>
        <DateRangeFilter
          value={dateRange}
          onChange={(value) => {
            setDateRange(value);
            setPage(1);
          }}
        />
        <div className="w-48">
          <CustomerSelect
            value={customerId}
            onValueChange={(value) => {
              setCustomerId(value);
              setPage(1);
            }}
            allowAllLabel="All customers"
          />
        </div>
      </Toolbar>

      {error ? (
        <ErrorState description="Could not load the sales report." onRetry={() => refetch()} />
      ) : data ? (
        <div className="flex flex-col gap-4">
          <ReportSummary
            items={[
              { label: "Invoices", value: data.summary.totalInvoices },
              { label: "Total sales", value: <CurrencyDisplay value={Number(data.summary.totalSales)} /> },
              { label: "Total outstanding", value: <CurrencyDisplay value={Number(data.summary.totalOutstanding)} /> },
            ]}
          />
          <DataTable columns={columns} data={data.items} rowKey={(row) => row.id} loading={isLoading} />
          <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
        </div>
      ) : null}
    </div>
  );
}
