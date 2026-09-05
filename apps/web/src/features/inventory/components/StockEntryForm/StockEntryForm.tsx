"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/forms/FormField";
import { ProductSelect } from "@/features/inventory/components/ProductSelect";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export type StockEntryFormValues = {
  productId: string;
  quantity: string;
  date: string;
  reason: string;
  notes: string;
};

export type StockEntryFormProps = {
  onSubmit: (values: StockEntryFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
  error?: string | null;
};

export function StockEntryForm({ onSubmit, onCancel, submitting = false, error }: StockEntryFormProps) {
  const [values, setValues] = useState<StockEntryFormValues>({
    productId: "",
    quantity: "",
    date: today(),
    reason: "Purchase",
    notes: "",
  });

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
        <FormField label="Quantity" htmlFor="quantity" required>
          <Input
            id="quantity"
            type="number"
            step="0.001"
            min="0"
            value={values.quantity}
            onChange={(event) => setValues((prev) => ({ ...prev, quantity: event.target.value }))}
            required
          />
        </FormField>
        <FormField label="Date" htmlFor="date" required>
          <Input
            id="date"
            type="date"
            value={values.date}
            onChange={(event) => setValues((prev) => ({ ...prev, date: event.target.value }))}
            required
          />
        </FormField>
        <FormField label="Reason" htmlFor="reason" className="sm:col-span-2">
          <Input
            id="reason"
            value={values.reason}
            onChange={(event) => setValues((prev) => ({ ...prev, reason: event.target.value }))}
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
        <Button type="submit" loading={submitting} disabled={!values.productId}>
          Add stock
        </Button>
      </div>
    </form>
  );
}
