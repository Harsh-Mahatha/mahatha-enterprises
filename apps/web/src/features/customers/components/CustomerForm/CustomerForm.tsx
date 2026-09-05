"use client";

import { useState, type FormEvent } from "react";
import type { Customer } from "@mahatha/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/forms/FormField";

export type CustomerFormValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  openingBalance: string;
};

function toFormValues(customer?: Customer): CustomerFormValues {
  return {
    name: customer?.name ?? "",
    phone: customer?.phone ?? "",
    email: customer?.email ?? "",
    address: customer?.address ?? "",
    openingBalance: customer?.openingBalance ?? "0",
  };
}

export type CustomerFormProps = {
  customer?: Customer;
  onSubmit: (values: CustomerFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
  error?: string | null;
};

export function CustomerForm({ customer, onSubmit, onCancel, submitting = false, error }: CustomerFormProps) {
  const [values, setValues] = useState<CustomerFormValues>(() => toFormValues(customer));
  const isCreate = !customer;

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
        <FormField label="Phone" htmlFor="phone">
          <Input
            id="phone"
            value={values.phone}
            onChange={(event) => setValues((prev) => ({ ...prev, phone: event.target.value }))}
          />
        </FormField>
        <FormField label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
          />
        </FormField>
        <FormField label="Address" htmlFor="address" className="sm:col-span-2">
          <Textarea
            id="address"
            rows={3}
            value={values.address}
            onChange={(event) => setValues((prev) => ({ ...prev, address: event.target.value }))}
          />
        </FormField>
        {isCreate ? (
          <FormField
            label="Opening balance"
            htmlFor="openingBalance"
            description="Amount already owed by this customer, if any. Cannot be changed later."
          >
            <Input
              id="openingBalance"
              type="number"
              step="0.01"
              value={values.openingBalance}
              onChange={(event) => setValues((prev) => ({ ...prev, openingBalance: event.target.value }))}
            />
          </FormField>
        ) : null}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {isCreate ? "Create customer" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
