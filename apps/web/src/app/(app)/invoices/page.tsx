"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import type { InvoiceStatus } from "@mahatha/types";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { SearchInput } from "@/components/forms/SearchInput";
import { Toolbar } from "@/components/layout/Toolbar";
import { Pagination } from "@/components/tables/Pagination";
import { ListPageLayout } from "@/components/templates";
import { InvoiceTable } from "@/features/invoices";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import * as invoiceService from "@/services/api/invoices";

const PAGE_SIZE = 20;

const statusOptions: { value: string; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "PAID", label: "Paid" },
  { value: "PARTIAL", label: "Partial" },
  { value: "UNPAID", label: "Unpaid" },
];

function InvoicesPageContent() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId") ?? undefined;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["invoices", { search: debouncedSearch, customerId, status, page }],
    queryFn: () =>
      invoiceService.listInvoices({
        search: debouncedSearch,
        customerId,
        status: status === "ALL" ? undefined : (status as InvoiceStatus),
        page,
        pageSize: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <ListPageLayout
      title="Invoices"
      description={customerId ? "Invoices for this customer." : "All sales invoices."}
      actions={
        <Button asChild>
          <Link href="/invoices/new">
            <Plus />
            Create invoice
          </Link>
        </Button>
      }
      toolbar={
        <Toolbar>
          <SearchInput
            placeholder="Search by invoice number or customer..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Toolbar>
      }
    >
      {error ? (
        <ErrorState description="Could not load invoices." onRetry={() => refetch()} />
      ) : (
        <div className="flex flex-col gap-4">
          <InvoiceTable invoices={data?.items ?? []} loading={isLoading} />
          {data ? (
            <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
          ) : null}
        </div>
      )}
    </ListPageLayout>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense>
      <InvoicesPageContent />
    </Suspense>
  );
}
