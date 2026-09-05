"use client";

import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ClipboardList, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { Pagination } from "@/components/tables/Pagination";
import { ProductTable } from "@/features/products";
import { StockMovementTable } from "@/features/inventory";
import * as productService from "@/services/api/products";
import * as inventoryService from "@/services/api/inventory";

const PAGE_SIZE = 20;

export default function InventoryPage() {
  const [movementsPage, setMovementsPage] = useState(1);

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products", { pageSize: 100 }],
    queryFn: () => productService.listProducts({ pageSize: 100 }),
  });

  const {
    data: movements,
    isLoading: movementsLoading,
    error: movementsError,
    refetch: refetchMovements,
  } = useQuery({
    queryKey: ["inventory", "movements", { page: movementsPage }],
    queryFn: () => inventoryService.listStockMovements({ page: movementsPage, pageSize: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inventory"
        description="Current stock levels and stock movement history."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/inventory/adjustment">
                <ClipboardList />
                Stock adjustment
              </Link>
            </Button>
            <Button asChild>
              <Link href="/inventory/entry">
                <PackagePlus />
                Stock entry
              </Link>
            </Button>
          </>
        }
      />
      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Current stock</TabsTrigger>
          <TabsTrigger value="history">Stock history</TabsTrigger>
        </TabsList>
        <TabsContent value="stock">
          {productsError ? (
            <ErrorState description="Could not load products." onRetry={() => refetchProducts()} />
          ) : (
            <ProductTable products={products?.items ?? []} loading={productsLoading} />
          )}
        </TabsContent>
        <TabsContent value="history">
          {movementsError ? (
            <ErrorState description="Could not load stock movements." onRetry={() => refetchMovements()} />
          ) : (
            <div className="flex flex-col gap-4">
              <StockMovementTable movements={movements?.items ?? []} loading={movementsLoading} />
              {movements ? (
                <Pagination
                  page={movements.meta.page}
                  totalPages={movements.meta.totalPages}
                  onPageChange={setMovementsPage}
                />
              ) : null}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
