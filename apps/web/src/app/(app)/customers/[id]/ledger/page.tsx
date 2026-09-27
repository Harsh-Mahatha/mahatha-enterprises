"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DescriptionItem } from "@/components/ui/DescriptionItem";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { Pagination } from "@/components/tables/Pagination";
import { LedgerTable } from "@/features/ledger";
import * as ledgerService from "@/services/api/ledger";

const PAGE_SIZE = 50;

export default function CustomerLedgerPage() {
  const { id: customerId } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["customers", customerId, "ledger", { page }],
    queryFn: () => ledgerService.getCustomerLedger(customerId, { page, pageSize: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return <ErrorState description="Could not load the customer ledger." onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${data.customer.name} — Ledger`}
        description="Opening balance, invoices, and payments for this customer."
        actions={
          <Button asChild>
            <Link href={`/payments/new?customerId=${customerId}`}>
              <Plus />
              Record payment
            </Link>
          </Button>
        }
      />
      <Card>
        <CardContent className="pt-6">
          <DescriptionItem label="Outstanding balance">
            <CurrencyDisplay value={data.outstanding} className="text-lg font-semibold" />
          </DescriptionItem>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4">
        <LedgerTable entries={data.items} />
        <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
