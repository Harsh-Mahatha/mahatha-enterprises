"use client";

import { useState, type FormEvent } from "react";
import type { Product, ProductUnit } from "@mahatha/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/forms/FormField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { productUnitOptions } from "@/constants/product-units";

export type ProductFormValues = {
  name: string;
  sku: string;
  unit: ProductUnit;
  sellingPrice: string;
  minStockLevel: string;
};

function toFormValues(product?: Product): ProductFormValues {
  return {
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    unit: product?.unit ?? "PIECE",
    sellingPrice: product?.sellingPrice ?? "",
    minStockLevel: product ? String(product.minStockLevel) : "0",
  };
}

export type ProductFormProps = {
  product?: Product;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
  error?: string | null;
};

export function ProductForm({ product, onSubmit, onCancel, submitting = false, error }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(() => toFormValues(product));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name" required className="sm:col-span-2">
          <Input
            id="name"
            value={values.name}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
        </FormField>
        <FormField label="SKU" htmlFor="sku" required>
          <Input
            id="sku"
            value={values.sku}
            onChange={(event) => setValues((prev) => ({ ...prev, sku: event.target.value }))}
            required
          />
        </FormField>
        <FormField label="Unit" htmlFor="unit" required>
          <Select value={values.unit} onValueChange={(value) => setValues((prev) => ({ ...prev, unit: value as ProductUnit }))}>
            <SelectTrigger id="unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {productUnitOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Selling price" htmlFor="sellingPrice" required>
          <Input
            id="sellingPrice"
            type="number"
            step="0.01"
            min="0"
            value={values.sellingPrice}
            onChange={(event) => setValues((prev) => ({ ...prev, sellingPrice: event.target.value }))}
            required
          />
        </FormField>
        <FormField label="Minimum stock level" htmlFor="minStockLevel" description="Triggers the low-stock indicator.">
          <Input
            id="minStockLevel"
            type="number"
            step="1"
            min="0"
            value={values.minStockLevel}
            onChange={(event) => setValues((prev) => ({ ...prev, minStockLevel: event.target.value }))}
          />
        </FormField>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {product ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
