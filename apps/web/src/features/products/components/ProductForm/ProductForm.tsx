"use client";

import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import type { Product } from "@mahatha/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/forms/FormField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { AddUnitDialog } from "@/features/products/components/AddUnitDialog";
import * as unitService from "@/services/api/units";

const DEFAULT_UNIT = "Piece";

export type ProductFormValues = {
  name: string;
  unit: string;
  mrp: string;
  sellingPrice: string;
  minStockLevel: string;
};

function toFormValues(product?: Product): ProductFormValues {
  return {
    name: product?.name ?? "",
    unit: product?.unit ?? DEFAULT_UNIT,
    mrp: product?.mrp ?? "",
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
  const [unitSelectOpen, setUnitSelectOpen] = useState(false);
  const [addUnitOpen, setAddUnitOpen] = useState(false);

  const { data: units, isLoading: unitsLoading } = useQuery({
    queryKey: ["units"],
    queryFn: unitService.listUnits,
    // Only changes through AddUnitDialog, which updates the cache itself.
    staleTime: Infinity,
  });

  // Keep the product's current unit selectable even if it's missing from the
  // list (e.g. while the list is still loading).
  const unitNames = units?.map((unit) => unit.name) ?? [];
  if (values.unit && !unitNames.includes(values.unit)) {
    unitNames.unshift(values.unit);
  }

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
        <FormField label="Unit" htmlFor="unit" required>
          <Select
            value={values.unit}
            onValueChange={(value) => setValues((prev) => ({ ...prev, unit: value }))}
            open={unitSelectOpen}
            onOpenChange={setUnitSelectOpen}
          >
            <SelectTrigger id="unit">
              <SelectValue placeholder={unitsLoading ? "Loading units…" : "Select a unit"} />
            </SelectTrigger>
            <SelectContent>
              {unitNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
              <div className="mt-1 border-t border-border pt-1">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium text-primary hover:bg-accent focus:bg-accent focus:outline-none"
                  onClick={() => {
                    setUnitSelectOpen(false);
                    setAddUnitOpen(true);
                  }}
                >
                  <Plus className="size-4" />
                  Add
                </button>
              </div>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="MRP" htmlFor="mrp" required>
          <Input
            id="mrp"
            type="number"
            step="0.01"
            min="0"
            value={values.mrp}
            onChange={(event) => setValues((prev) => ({ ...prev, mrp: event.target.value }))}
            required
          />
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
      <AddUnitDialog
        open={addUnitOpen}
        onOpenChange={setAddUnitOpen}
        onCreated={(unit) => setValues((prev) => ({ ...prev, unit: unit.name }))}
      />
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
