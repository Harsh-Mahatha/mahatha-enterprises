"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Printer } from "lucide-react";
import { getInvoiceOutstanding } from "@mahatha/calculations";
import type { InvoiceStatus } from "@mahatha/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DateDisplay } from "@/components/ui/DateDisplay";
import { DescriptionItem } from "@/components/ui/DescriptionItem";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { PageHeader } from "@/components/layout/PageHeader";
import { InvoiceSummary } from "@/features/invoices";
import * as invoiceService from "@/services/api/invoices";

const statusVariant: Record<InvoiceStatus, "success" | "warning" | "error"> = {
  PAID: "success",
  PARTIAL: "warning",
  UNPAID: "error",
};

export default function InvoiceDetailPage() {
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

  const outstandingStr = getInvoiceOutstanding(invoice);
  const outstanding = Number(outstandingStr);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={invoice.invoiceNumber}
        description={invoice.customer ? `Billed to ${invoice.customer.name}` : undefined}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/invoices/${invoice.id}/print`}>
                <Printer />
                Print
              </Link>
            </Button>
            {outstanding > 0 ? (
              <Button variant="outline" asChild>
                <Link href={`/payments/new?customerId=${invoice.customerId}`}>Record payment</Link>
              </Button>
            ) : null}
            <Button variant="outline" asChild>
              <Link href={`/customers/${invoice.customerId}/ledger`}>View ledger</Link>
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
          <DescriptionItem label="Date">
            <DateDisplay value={invoice.date} />
          </DescriptionItem>
          <DescriptionItem label="Customer">
            {invoice.customer ? (
              <Link href={`/customers/${invoice.customerId}`} className="hover:underline">
                {invoice.customer.name}
              </Link>
            ) : (
              "—"
            )}
          </DescriptionItem>
          <DescriptionItem label="Status">
            <Badge variant={statusVariant[invoice.status]}>{invoice.status}</Badge>
          </DescriptionItem>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(invoice.items ?? []).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product?.name ?? "—"}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-right">
                  <CurrencyDisplay value={Number(item.unitPrice)} />
                </TableCell>
                <TableCell className="text-right">
                  <CurrencyDisplay value={Number(item.lineTotal)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 sm:items-start">
        {invoice.notes ? <DescriptionItem label="Notes">{invoice.notes}</DescriptionItem> : <div />}
        <InvoiceSummary
          subtotal={invoice.subtotal}
          discountTotal={invoice.discountTotal}
          total={invoice.total}
          outstanding={outstandingStr}
        />
      </div>
    </div>
  );
}
