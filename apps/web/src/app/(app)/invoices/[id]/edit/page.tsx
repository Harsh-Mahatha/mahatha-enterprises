"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { calculateInvoice, validateInvoiceCalculation } from "@mahatha/calculations";
import type { Invoice } from "@mahatha/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DescriptionItem } from "@/components/ui/DescriptionItem";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { toast } from "@/components/ui/Toast";
import { FormField } from "@/components/forms/FormField";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  DiscountLine,
  InvoiceItemsTable,
  InvoiceSummary,
  type DiscountLineValue,
  type InvoiceLineValue,
} from "@/features/invoices";
import { ApiError } from "@/services/api/client";
import * as invoiceService from "@/services/api/invoices";

function toDateInputValue(date: string): string {
  return date.slice(0, 10);
}

function itemsFromInvoice(invoice: Invoice): InvoiceLineValue[] {
  return (invoice.items ?? []).map((item) => ({
    key: item.id,
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));
}

function discountsFromInvoice(invoice: Invoice): DiscountLineValue[] {
  return (invoice.discounts ?? []).map((discount) => ({
    key: discount.id,
    description: discount.description ?? "",
    amount: discount.amount,
  }));
}

export default function EditInvoicePage() {
  const { id: invoiceId } = useParams<{ id: string }>();

  const {
    data: invoice,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["invoices", invoiceId],
    queryFn: () => invoiceService.getInvoice(invoiceId),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !invoice) {
    return <ErrorState description="Could not load this invoice." onRetry={() => refetch()} />;
  }

  return <EditInvoiceForm invoice={invoice} />;
}

function EditInvoiceForm({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [date, setDate] = useState(() => toDateInputValue(invoice.date));
  const [items, setItems] = useState<InvoiceLineValue[]>(() => itemsFromInvoice(invoice));
  const [discounts, setDiscounts] = useState<DiscountLineValue[]>(() => discountsFromInvoice(invoice));
  const [notes, setNotes] = useState(invoice.notes ?? "");
  const [error, setError] = useState<string | null>(null);

  const amountPaid = Number(invoice.amountPaid);

  const calculation = useMemo(
    () =>
      calculateInvoice({
        items: items.map((item) => ({ quantity: item.quantity || 0, unitPrice: item.unitPrice || 0 })),
        discounts: discounts.map((discount) => ({ amount: discount.amount || 0 })),
        paymentReceived: amountPaid,
      }),
    [items, discounts, amountPaid],
  );

  const calculationIssues = useMemo(() => validateInvoiceCalculation(calculation), [calculation]);

  const mutation = useMutation({
    mutationFn: () =>
      invoiceService.updateInvoice(invoice.id, {
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
        notes: notes || undefined,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["invoices", invoice.id], updated);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice updated.");
      router.push(`/invoices/${invoice.id}`);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    },
  });

  const validItems = items.filter((item) => item.productId && Number(item.quantity) > 0);
  const canSave = validItems.length > 0 && calculationIssues.length === 0;

  function handleSave() {
    setError(null);
    mutation.mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit ${invoice.invoiceNumber}`}
        description={invoice.customer ? `Billed to ${invoice.customer.name}` : undefined}
      />

      <Card>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
          <DescriptionItem label="Customer">{invoice.customer?.name ?? "—"}</DescriptionItem>
          <FormField label="Date" htmlFor="date" required>
            <Input id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
          </FormField>
          <DescriptionItem label="Amount paid" className="sm:items-end sm:text-right">
            <CurrencyDisplay value={amountPaid} />
          </DescriptionItem>
        </CardContent>
      </Card>

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
        <FormField label="Notes" htmlFor="notes">
          <Textarea id="notes" rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} />
        </FormField>
        <InvoiceSummary
          subtotal={calculation.subtotal}
          discountTotal={calculation.discountTotal}
          total={calculation.total}
          outstanding={calculation.outstanding}
        />
      </div>

      {calculationIssues.length > 0 ? <p className="text-sm text-destructive">{calculationIssues[0].message}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/invoices/${invoice.id}`)}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} loading={mutation.isPending} disabled={!canSave}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
