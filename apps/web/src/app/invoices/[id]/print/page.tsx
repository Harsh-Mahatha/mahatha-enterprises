"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { PrintableInvoice } from "@/features/invoices";
import * as invoiceService from "@/services/api/invoices";
import * as settingsService from "@/services/api/settings";

export default function InvoicePrintPage() {
  const { id: invoiceId } = useParams<{ id: string }>();
  const hasAutoPrintedRef = useRef(false);

  const {
    data: invoice,
    isLoading: invoiceLoading,
    error: invoiceError,
    refetch: refetchInvoice,
  } = useQuery({
    queryKey: ["invoices", invoiceId],
    queryFn: () => invoiceService.getInvoice(invoiceId),
  });

  const {
    data: companySettings,
    isLoading: settingsLoading,
    error: settingsError,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ["settings", "company"],
    queryFn: settingsService.getCompanySettings,
  });

  useEffect(() => {
    if (invoice && companySettings && !hasAutoPrintedRef.current) {
      hasAutoPrintedRef.current = true;
      window.print();
    }
  }, [invoice, companySettings]);

  if (invoiceLoading || settingsLoading) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-3 p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (invoiceError || settingsError || !invoice || !companySettings) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <ErrorState
          description="Could not load this invoice for printing."
          onRetry={() => {
            refetchInvoice();
            refetchSettings();
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-8 print:p-0">
      <div className="mb-4 flex justify-end print:hidden">
        <Button onClick={() => window.print()}>
          <Printer />
          Print
        </Button>
      </div>
      <PrintableInvoice invoice={invoice} companySettings={companySettings} />
    </div>
  );
}
