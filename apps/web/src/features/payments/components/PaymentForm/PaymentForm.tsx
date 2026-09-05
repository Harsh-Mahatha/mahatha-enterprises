"use client";

import { useState, type FormEvent } from "react";
import type { PaymentMode } from "@mahatha/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/forms/FormField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { CustomerSelect } from "@/features/customers/components/CustomerSelect";

const modeOptions: { value: PaymentMode; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK", label: "Bank" },
  { value: "OTHER", label: "Other" },
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export type PaymentFormValues = {
  customerId: string;
  amount: string;
  mode: PaymentMode;
  date: string;
  reference: string;
  notes: string;
};

export type PaymentFormProps = {
  initialCustomerId?: string;
  onSubmit: (values: PaymentFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
  error?: string | null;
};

export function PaymentForm({
  initialCustomerId,
  onSubmit,
  onCancel,
  submitting = false,
  error,
}: PaymentFormProps) {
  const [values, setValues] = useState<PaymentFormValues>({
    customerId: initialCustomerId ?? "",
    amount: "",
    mode: "CASH",
    date: today(),
    reference: "",
    notes: "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Customer" htmlFor="customerId" required className="sm:col-span-2">
          <CustomerSelect
            id="customerId"
            value={values.customerId}
            onValueChange={(value) => setValues((prev) => ({ ...prev, customerId: value }))}
          />
        </FormField>
        <FormField label="Amount" htmlFor="amount" required>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={values.amount}
            onChange={(event) => setValues((prev) => ({ ...prev, amount: event.target.value }))}
            required
          />
        </FormField>
        <FormField label="Payment mode" htmlFor="mode" required>
          <Select
            value={values.mode}
            onValueChange={(value) => setValues((prev) => ({ ...prev, mode: value as PaymentMode }))}
          >
            <SelectTrigger id="mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <FormField label="Reference" htmlFor="reference" description="e.g. transaction ID or cheque number.">
          <Input
            id="reference"
            value={values.reference}
            onChange={(event) => setValues((prev) => ({ ...prev, reference: event.target.value }))}
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
        <Button type="submit" loading={submitting} disabled={!values.customerId}>
          Record payment
        </Button>
      </div>
    </form>
  );
}
