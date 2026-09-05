"use client";

import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { SearchInput } from "@/components/forms/SearchInput";
import { Toolbar } from "@/components/layout/Toolbar";
import { Pagination } from "@/components/tables/Pagination";
import { ListPageLayout } from "@/components/templates";
import { CustomerTable } from "@/features/customers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import * as customerService from "@/services/api/customers";

const PAGE_SIZE = 20;

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["customers", { search: debouncedSearch, page }],
    queryFn: () => customerService.listCustomers({ search: debouncedSearch, page, pageSize: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  return (
    <ListPageLayout
      title="Customers"
      description="Manage the people and businesses you sell to."
      actions={
        <Button asChild>
          <Link href="/customers/new">
            <Plus />
            Add customer
          </Link>
        </Button>
      }
      toolbar={
        <Toolbar>
          <SearchInput
            placeholder="Search by name or phone..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </Toolbar>
      }
    >
      {error ? (
        <ErrorState description="Could not load customers." onRetry={() => refetch()} />
      ) : (
        <div className="flex flex-col gap-4">
          <CustomerTable customers={data?.items ?? []} loading={isLoading} />
          {data ? (
            <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
          ) : null}
        </div>
      )}
    </ListPageLayout>
  );
}
