"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { PaymentForm, type PaymentFormValues } from "@/features/payments";
import { ApiError } from "@/services/api/client";
import * as paymentService from "@/services/api/payments";

function NewPaymentPageContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const initialCustomerId = searchParams.get("customerId") ?? undefined;
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: PaymentFormValues) =>
      paymentService.createPayment({
        customerId: values.customerId,
        amount: Number(values.amount),
        mode: values.mode,
        date: values.date,
        reference: values.reference,
        notes: values.notes,
      }),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["customers", payment.customerId] });
      router.push(`/customers/${payment.customerId}/ledger`);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Record payment" description="Record money received from a customer." />
      <PaymentForm
        initialCustomerId={initialCustomerId}
        onSubmit={(values) => {
          setError(null);
          mutation.mutate(values);
        }}
        onCancel={() => router.back()}
        submitting={mutation.isPending}
        error={error}
      />
    </div>
  );
}

export default function NewPaymentPage() {
  return (
    <Suspense>
      <NewPaymentPageContent />
    </Suspense>
  );
}
