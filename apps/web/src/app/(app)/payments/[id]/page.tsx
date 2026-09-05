"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { PaymentSummary } from "@/features/payments";
import { formatDate } from "@/utils/format";
import * as paymentService from "@/services/api/payments";

export default function PaymentDetailPage() {
  const { id: paymentId } = useParams<{ id: string }>();

  const {
    data: payment,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["payments", paymentId],
    queryFn: () => paymentService.getPayment(paymentId),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !payment) {
    return <ErrorState description="Could not load this payment." onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Payment details" description={`Recorded on ${formatDate(payment.date)}`} />
      <PaymentSummary payment={payment} />
    </div>
  );
}
