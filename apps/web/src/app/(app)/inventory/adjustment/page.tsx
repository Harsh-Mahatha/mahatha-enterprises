"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { toast } from "@/components/ui/Toast";
import { StockAdjustmentForm, type StockAdjustmentFormValues } from "@/features/inventory";
import { ApiError } from "@/services/api/client";
import * as inventoryService from "@/services/api/inventory";

export default function StockAdjustmentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: StockAdjustmentFormValues) =>
      inventoryService.createStockAdjustment({
        productId: values.productId,
        actualStock: Number(values.actualStock),
        reason: values.reason,
        notes: values.notes,
      }),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success(`Stock corrected for ${product.name}.`);
      router.push("/inventory");
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Stock adjustment" description="Correct the system stock after a physical count." />
      <StockAdjustmentForm
        onSubmit={(values) => {
          setError(null);
          mutation.mutate(values);
        }}
        onCancel={() => router.back()}
        submitting={mutation.isPending}
        error={error}
      />
    </div>
  );
}
