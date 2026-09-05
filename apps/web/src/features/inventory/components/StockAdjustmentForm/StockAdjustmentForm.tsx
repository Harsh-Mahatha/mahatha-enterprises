"use client";

import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/forms/FormField";
import { Text } from "@/components/ui/Typography";
import { ProductSelect } from "@/features/inventory/components/ProductSelect";
import * as productService from "@/services/api/products";

export type StockAdjustmentFormValues = {
  productId: string;
  actualStock: string;
  reason: string;
  notes: string;
};

export type StockAdjustmentFormProps = {
  onSubmit: (values: StockAdjustmentFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
  error?: string | null;
};

export function StockAdjustmentForm({ onSubmit, onCancel, submitting = false, error }: StockAdjustmentFormProps) {
  const [values, setValues] = useState<StockAdjustmentFormValues>({
    productId: "",
    actualStock: "",
    reason: "Physical stock correction",
    notes: "",
  });

  const { data: selectedProduct } = useQuery({
    queryKey: ["products", values.productId],
    queryFn: () => productService.getProduct(values.productId),
    enabled: values.productId.length > 0,
  });

  const systemStock = selectedProduct ? Number(selectedProduct.currentStock) : null;
  const delta = systemStock !== null && values.actualStock !== "" ? Number(values.actualStock) - systemStock : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Product" htmlFor="productId" required className="sm:col-span-2">
          <ProductSelect
            id="productId"
            value={values.productId}
            onValueChange={(value) => setValues((prev) => ({ ...prev, productId: value }))}
          />
        </FormField>
        {systemStock !== null ? (
          <div className="sm:col-span-2">
            <Text variant="muted">
              System stock: <span className="font-medium text-foreground">{systemStock}</span>
            </Text>
          </div>
        ) : null}
        <FormField
          label="Actual stock"
          htmlFor="actualStock"
          required
          description="The quantity you physically counted."
        >
          <Input
            id="actualStock"
            type="number"
            step="0.001"
            min="0"
            value={values.actualStock}
            onChange={(event) => setValues((prev) => ({ ...prev, actualStock: event.target.value }))}
            required
          />
        </FormField>
        {delta !== null ? (
          <div className="flex items-end">
            <Text variant="muted">
              Adjustment:{" "}
              <span className={delta < 0 ? "font-medium text-destructive" : "font-medium text-foreground"}>
                {delta > 0 ? `+${delta}` : delta}
              </span>
            </Text>
          </div>
        ) : null}
        <FormField label="Reason" htmlFor="reason" required className="sm:col-span-2">
          <Input
            id="reason"
            value={values.reason}
            onChange={(event) => setValues((prev) => ({ ...prev, reason: event.target.value }))}
            required
          />
        </FormField>
        <FormField label="Notes" htmlFor="notes" className="sm:col-span-2">
          <Textarea
            id="notes"
            rows={3}
            value={values.notes}
            onChange={(event) => setValues((prev) => ({ ...prev, notes: event.target.value }))}
          />
        </FormField>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting} disabled={!values.productId || values.actualStock === ""}>
          Save adjustment
        </Button>
      </div>
    </form>
  );
}
