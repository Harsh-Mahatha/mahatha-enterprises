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
import { ProductTable } from "@/features/products";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import * as productService from "@/services/api/products";

const PAGE_SIZE = 20;

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products", { search: debouncedSearch, page }],
    queryFn: () => productService.listProducts({ search: debouncedSearch, page, pageSize: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  return (
    <ListPageLayout
      title="Products"
      description="Manage what you sell and their selling prices."
      actions={
        <Button asChild>
          <Link href="/products/new">
            <Plus />
            Add product
          </Link>
        </Button>
      }
      toolbar={
        <Toolbar>
          <SearchInput
            placeholder="Search by name or SKU..."
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
        <ErrorState description="Could not load products." onRetry={() => refetch()} />
      ) : (
        <div className="flex flex-col gap-4">
          <ProductTable products={data?.items ?? []} loading={isLoading} />
          {data ? (
            <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
          ) : null}
        </div>
      )}
    </ListPageLayout>
  );
}
