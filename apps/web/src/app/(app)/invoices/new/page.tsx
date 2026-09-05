"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { calculateInvoice, validateInvoiceCalculation } from "@mahatha/calculations";
import type { PaymentMode } from "@mahatha/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/forms/FormField";
import { PageHeader } from "@/components/layout/PageHeader";
import { CustomerSelect } from "@/features/customers";
import {
  DiscountLine,
  InvoiceItemsTable,
  InvoiceSummary,
  PaymentInput,
  type DiscountLineValue,
  type InvoiceLineValue,
} from "@/features/invoices";
import { ApiError } from "@/services/api/client";
import * as invoiceService from "@/services/api/invoices";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyLine(): InvoiceLineValue {
  return { key: crypto.randomUUID(), productId: "", quantity: "1", unitPrice: "" };
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState(today());
  const [items, setItems] = useState<InvoiceLineValue[]>([emptyLine()]);
  const [discounts, setDiscounts] = useState<DiscountLineValue[]>([]);
  const [paymentReceived, setPaymentReceived] = useState("0");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("CASH");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const calculation = useMemo(
    () =>
      calculateInvoice({
        items: items.map((item) => ({ quantity: item.quantity || 0, unitPrice: item.unitPrice || 0 })),
        discounts: discounts.map((discount) => ({ amount: discount.amount || 0 })),
        paymentReceived: paymentReceived || 0,
      }),
    [items, discounts, paymentReceived],
  );

  const calculationIssues = useMemo(() => validateInvoiceCalculation(calculation), [calculation]);

  const mutation = useMutation({
    mutationFn: () =>
      invoiceService.createInvoice({
        customerId,
        date,
        items: items
          .filter((item) => item.productId)
          .map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
        discounts: discounts
          .filter((discount) => discount.amount)
          .map((discount) => ({
            description: discount.description || undefined,
            amount: Number(discount.amount),
          })),
        paymentReceived: Number(paymentReceived) || 0,
        paymentMode: Number(paymentReceived) > 0 ? paymentMode : undefined,
        notes: notes || undefined,
      }),
    onSuccess: (invoice) => {
      router.push(`/invoices/${invoice.id}`);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    },
  });

  const validItems = items.filter((item) => item.productId && Number(item.quantity) > 0);
  const canSave = customerId.length > 0 && validItems.length > 0 && calculationIssues.length === 0;

  function handleSave() {
    setError(null);
    mutation.mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Create invoice" description="Record a new sale." />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Customer" htmlFor="customerId" required>
          <CustomerSelect id="customerId" value={customerId} onValueChange={setCustomerId} />
        </FormField>
        <FormField label="Date" htmlFor="date" required>
          <Input id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
        </FormField>
      </div>

      <InvoiceItemsTable items={items} lineTotals={calculation.lineTotals} onChange={setItems} />

      <div className="flex flex-col gap-2">
        {discounts.map((discount) => (
          <DiscountLine
            key={discount.key}
            value={discount}
            onChange={(value) => setDiscounts((prev) => prev.map((d) => (d.key === value.key ? value : d)))}
            onRemove={() => setDiscounts((prev) => prev.filter((d) => d.key !== discount.key))}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => setDiscounts((prev) => [...prev, { key: crypto.randomUUID(), description: "", amount: "" }])}
        >
          Add discount
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <PaymentInput
          amount={paymentReceived}
          mode={paymentMode}
          onAmountChange={setPaymentReceived}
          onModeChange={setPaymentMode}
        />
        <InvoiceSummary
          subtotal={calculation.subtotal}
          discountTotal={calculation.discountTotal}
          total={calculation.total}
          outstanding={calculation.outstanding}
        />
      </div>

      <FormField label="Notes" htmlFor="notes">
        <Textarea id="notes" rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} />
      </FormField>

      {calculationIssues.length > 0 ? <p className="text-sm text-destructive">{calculationIssues[0].message}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} loading={mutation.isPending} disabled={!canSave}>
          Save invoice
        </Button>
      </div>
    </div>
  );
}
