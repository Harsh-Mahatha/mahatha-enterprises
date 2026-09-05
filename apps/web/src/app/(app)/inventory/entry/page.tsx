"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { toast } from "@/components/ui/Toast";
import { StockEntryForm, type StockEntryFormValues } from "@/features/inventory";
import { ApiError } from "@/services/api/client";
import * as inventoryService from "@/services/api/inventory";

export default function StockEntryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: StockEntryFormValues) =>
      inventoryService.createStockEntry({
        productId: values.productId,
        quantity: Number(values.quantity),
        date: values.date,
        reason: values.reason,
        notes: values.notes,
      }),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success(`Stock updated for ${product.name}.`);
      router.push("/inventory");
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Stock entry" description="Record stock received from outside the system." />
      <StockEntryForm
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
