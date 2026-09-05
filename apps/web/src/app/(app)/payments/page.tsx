"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListPageLayout } from "@/components/templates";
import { Pagination } from "@/components/tables/Pagination";
import { PaymentTable } from "@/features/payments";
import * as paymentService from "@/services/api/payments";

const PAGE_SIZE = 20;

function PaymentsPageContent() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId") ?? undefined;
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["payments", { customerId, page }],
    queryFn: () => paymentService.listPayments({ customerId, page, pageSize: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  return (
    <ListPageLayout
      title="Payments"
      description={customerId ? "Payment history for this customer." : "All recorded payments."}
      actions={
        <Button asChild>
          <Link href={customerId ? `/payments/new?customerId=${customerId}` : "/payments/new"}>
            <Plus />
            Record payment
          </Link>
        </Button>
      }
    >
      {error ? (
        <ErrorState description="Could not load payments." onRetry={() => refetch()} />
      ) : (
        <div className="flex flex-col gap-4">
          <PaymentTable payments={data?.items ?? []} loading={isLoading} showCustomer={!customerId} />
          {data ? (
            <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
          ) : null}
        </div>
      )}
    </ListPageLayout>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense>
      <PaymentsPageContent />
    </Suspense>
  );
}
