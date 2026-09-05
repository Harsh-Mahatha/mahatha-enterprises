"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { CustomerForm, type CustomerFormValues } from "@/features/customers";
import { ApiError } from "@/services/api/client";
import * as customerService from "@/services/api/customers";

export default function NewCustomerPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: CustomerFormValues) =>
      customerService.createCustomer({
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: values.address,
        openingBalance: values.openingBalance ? Number(values.openingBalance) : 0,
      }),
    onSuccess: (customer) => {
      router.push(`/customers/${customer.id}`);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add customer" description="Create a new customer record." />
      <CustomerForm
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
