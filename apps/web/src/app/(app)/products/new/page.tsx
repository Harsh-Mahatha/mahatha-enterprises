"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductForm, type ProductFormValues } from "@/features/products";
import { ApiError } from "@/services/api/client";
import * as productService from "@/services/api/products";

export default function NewProductPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: ProductFormValues) =>
      productService.createProduct({
        name: values.name,
        sku: values.sku,
        unit: values.unit,
        sellingPrice: Number(values.sellingPrice),
        minStockLevel: Number(values.minStockLevel || 0),
      }),
    onSuccess: (product) => {
      router.push(`/products/${product.id}`);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add product" description="Create a new product record." />
      <ProductForm
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
