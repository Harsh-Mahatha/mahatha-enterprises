"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "@/components/ui/Toast";
import { Heading } from "@/components/ui/Typography";
import { DetailPageLayout } from "@/components/templates";
import { ProductForm, ProductSummary, type ProductFormValues } from "@/features/products";
import { StockMovementTable } from "@/features/inventory";
import { ApiError } from "@/services/api/client";
import * as productService from "@/services/api/products";
import * as inventoryService from "@/services/api/inventory";

export default function ProductDetailPage() {
  const { id: productId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", productId],
    queryFn: () => productService.getProduct(productId),
  });

  const { data: movements, isLoading: movementsLoading } = useQuery({
    queryKey: ["inventory", "movements", { productId }],
    queryFn: () => inventoryService.listStockMovements({ productId, pageSize: 50 }),
  });

  const [editing, setEditing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (values: ProductFormValues) =>
      productService.updateProduct(productId, {
        name: values.name,
        unit: values.unit,
        mrp: Number(values.mrp),
        sellingPrice: Number(values.sellingPrice),
        minStockLevel: Number(values.minStockLevel || 0),
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["products", productId], updated);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditing(false);
      toast.success("Product updated.");
    },
    onError: (err) => {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: (active: boolean) => productService.setProductActive(productId, active),
    onSuccess: (updated) => {
      queryClient.setQueryData(["products", productId], updated);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(updated.active ? "Product activated." : "Product deactivated.");
    },
    onError: () => {
      toast.error("Could not update product status.");
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !product) {
    return <ErrorState description="Could not load this product." onRetry={() => refetch()} />;
  }

  return (
    <>
      <DetailPageLayout
        title={product.name}
        description={`SKU: ${product.sku}`}
        actions={
          editing ? null : (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button
                variant={product.active ? "destructive" : "outline"}
                onClick={() => (product.active ? setConfirmOpen(true) : statusMutation.mutate(true))}
                loading={statusMutation.isPending}
              >
                {product.active ? "Deactivate" : "Activate"}
              </Button>
            </>
          )
        }
      >
        {editing ? (
          <ProductForm
            product={product}
            onSubmit={(values) => {
              setFormError(null);
              updateMutation.mutate(values);
            }}
            onCancel={() => {
              setFormError(null);
              setEditing(false);
            }}
            submitting={updateMutation.isPending}
            error={formError}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <ProductSummary product={product} />
            <div className="flex flex-col gap-3">
              <Heading as="h2">Stock history</Heading>
              <StockMovementTable movements={movements?.items ?? []} loading={movementsLoading} showProduct={false} />
            </div>
          </div>
        )}
      </DetailPageLayout>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Deactivate this product?"
        description="It will no longer be selectable for new sales, but its history is kept."
        confirmLabel="Deactivate"
        destructive
        loading={statusMutation.isPending}
        onConfirm={() => {
          statusMutation.mutate(false, { onSuccess: () => setConfirmOpen(false) });
        }}
      />
    </>
  );
}
