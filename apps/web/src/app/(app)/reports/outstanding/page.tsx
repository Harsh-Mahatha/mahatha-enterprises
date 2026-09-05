"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { OutstandingReportItem } from "@mahatha/types";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { ReportSummary } from "@/features/reports";
import * as reportsService from "@/services/api/reports";

const columns: DataTableColumn<OutstandingReportItem>[] = [
  { id: "customer", header: "Customer", cell: (row) => row.customerName },
  {
    id: "outstanding",
    header: "Outstanding",
    cell: (row) => <CurrencyDisplay value={Number(row.outstanding)} />,
    className: "text-right",
  },
];

export default function OutstandingReportPage() {
  const router = useRouter();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["reports", "outstanding"],
    queryFn: reportsService.getOutstandingReport,
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Outstanding report" description="Customers who currently owe money, highest first." />

      {error ? (
        <ErrorState description="Could not load the outstanding report." onRetry={() => refetch()} />
      ) : data ? (
        <div className="flex flex-col gap-4">
          <ReportSummary
            items={[
              { label: "Customers owing", value: data.summary.totalCustomers },
              { label: "Total outstanding", value: <CurrencyDisplay value={Number(data.summary.totalOutstanding)} /> },
            ]}
          />
          <DataTable
            columns={columns}
            data={data.items}
            rowKey={(row) => row.customerId}
            loading={isLoading}
            emptyTitle="No outstanding balances."
            emptyDescription="Every customer is fully paid up."
            onRowClick={(row) => router.push(`/customers/${row.customerId}/ledger`)}
          />
        </div>
      ) : null}
    </div>
  );
}
