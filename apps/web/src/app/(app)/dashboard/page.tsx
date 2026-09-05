"use client";

import { useQuery } from "@tanstack/react-query";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Heading } from "@/components/ui/Typography";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/features/dashboard";
import { InvoiceTable } from "@/features/invoices";
import * as dashboardService from "@/services/api/dashboard";

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getDashboardSummary,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Dashboard" description="A quick look at today's business." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <ErrorState description="Could not load the dashboard." onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="A quick look at today's business." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Today's sales" value={<CurrencyDisplay value={Number(data.todaysSales)} />} />
        <StatCard label="Outstanding" value={<CurrencyDisplay value={Number(data.outstanding)} />} />
        <StatCard label="Customers" value={data.totalCustomers} href="/customers" />
        <StatCard
          label="Low stock"
          value={data.lowStockCount}
          href="/inventory"
          emphasis={data.lowStockCount > 0 ? "warning" : "default"}
        />
        <StatCard label="Today's invoices" value={data.todaysInvoiceCount} href="/invoices" />
      </div>

      <div className="flex flex-col gap-3">
        <Heading as="h2">Recent invoices</Heading>
        <InvoiceTable invoices={data.recentInvoices} />
      </div>
    </div>
  );
}
