"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "@/components/ui/Toast";
import { DetailPageLayout } from "@/components/templates";
import { CustomerForm, CustomerSummary, type CustomerFormValues } from "@/features/customers";
import { ApiError } from "@/services/api/client";
import * as customerService from "@/services/api/customers";

export default function CustomerDetailPage() {
  const { id: customerId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    data: customer,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customers", customerId],
    queryFn: () => customerService.getCustomer(customerId),
  });

  const [editing, setEditing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (values: CustomerFormValues) =>
      customerService.updateCustomer(customerId, {
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: values.address,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["customers", customerId], updated);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setEditing(false);
      toast.success("Customer updated.");
    },
    onError: (err) => {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: (active: boolean) => customerService.setCustomerActive(customerId, active),
    onSuccess: (updated) => {
      queryClient.setQueryData(["customers", customerId], updated);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(updated.active ? "Customer activated." : "Customer deactivated.");
    },
    onError: () => {
      toast.error("Could not update customer status.");
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !customer) {
    return <ErrorState description="Could not load this customer." onRetry={() => refetch()} />;
  }

  return (
    <>
      <DetailPageLayout
        title={customer.name}
        description={customer.active ? "Active customer" : "Inactive customer"}
        actions={
          editing ? null : (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button
                variant={customer.active ? "destructive" : "outline"}
                onClick={() => (customer.active ? setConfirmOpen(true) : statusMutation.mutate(true))}
                loading={statusMutation.isPending}
              >
                {customer.active ? "Deactivate" : "Activate"}
              </Button>
            </>
          )
        }
      >
        {editing ? (
          <CustomerForm
            customer={customer}
            onSubmit={(values) => {
              setFormError(null);
              updateMutation.mutate(values);
            }}
            onCancel={() => {
              setFormError(null);
              setEditing(false);
            }}
            submitting={updateMutation.isPending}
            error={formError}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <CustomerSummary customer={customer} />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/customers/${customer.id}/ledger`}>View ledger</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/invoices?customerId=${customer.id}`}>View invoices</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/payments?customerId=${customer.id}`}>View payments</Link>
              </Button>
            </div>
          </div>
        )}
      </DetailPageLayout>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Deactivate this customer?"
        description="They will no longer appear as active, but their history is kept."
        confirmLabel="Deactivate"
        destructive
        loading={statusMutation.isPending}
        onConfirm={() => {
          statusMutation.mutate(false, { onSuccess: () => setConfirmOpen(false) });
        }}
      />
    </>
  );
}
