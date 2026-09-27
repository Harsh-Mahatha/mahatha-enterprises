"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CompanySettings } from "@mahatha/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { FormField } from "@/components/forms/FormField";
import { FormPageLayout } from "@/components/templates";
import { toast } from "@/components/ui/Toast";
import { ApiError } from "@/services/api/client";
import * as settingsService from "@/services/api/settings";

const SETTINGS_QUERY_KEY = ["settings", "company"] as const;

type FormState = {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  invoicePrefix: string;
};

function toFormState(settings: CompanySettings): FormState {
  return {
    businessName: settings.businessName,
    address: settings.address ?? "",
    phone: settings.phone ?? "",
    email: settings.email ?? "",
    logoUrl: settings.logoUrl ?? "",
    invoicePrefix: settings.invoicePrefix,
  };
}

export function CompanySettingsForm() {
  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: settingsService.getCompanySettings,
    // Only changes through this form, which writes the result into the cache.
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error || !settings) {
    return <ErrorState description="Could not load company settings." onRetry={() => refetch()} />;
  }

  // Keyed by updatedAt so a fresh (uncontrolled-from-here-on) form instance is
  // created whenever the saved record actually changes, without an effect.
  return <CompanySettingsFields key={settings.updatedAt} initialSettings={settings} />;
}

function CompanySettingsFields({ initialSettings }: { initialSettings: CompanySettings }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => toFormState(initialSettings));
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: settingsService.updateCompanySettings,
    onSuccess: (updated) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, updated);
      toast.success("Company settings saved.");
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    mutation.mutate(form);
  }

  return (
    <FormPageLayout
      title="Settings"
      description="Manage the company details used on invoices."
      headerActions={
        <Button variant="outline" asChild>
          <Link href="/settings/change-password">Change password</Link>
        </Button>
      }
      onSubmit={handleSubmit}
      actions={
        <Button type="submit" loading={mutation.isPending}>
          Save changes
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Business name" htmlFor="businessName" required className="sm:col-span-2">
          <Input
            id="businessName"
            value={form.businessName}
            onChange={(event) => setForm((prev) => ({ ...prev, businessName: event.target.value }))}
            required
          />
        </FormField>
        <FormField label="Address" htmlFor="address" className="sm:col-span-2">
          <Textarea
            id="address"
            rows={3}
            value={form.address}
            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
          />
        </FormField>
        <FormField label="Phone" htmlFor="phone">
          <Input
            id="phone"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          />
        </FormField>
        <FormField label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
        </FormField>
        <FormField label="Logo URL" htmlFor="logoUrl" description="Shown on printed invoices.">
          <Input
            id="logoUrl"
            type="url"
            value={form.logoUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, logoUrl: event.target.value }))}
          />
        </FormField>
        <FormField label="Invoice prefix" htmlFor="invoicePrefix" required description="e.g. INV- in INV-000001.">
          <Input
            id="invoicePrefix"
            value={form.invoicePrefix}
            onChange={(event) => setForm((prev) => ({ ...prev, invoicePrefix: event.target.value }))}
            required
          />
        </FormField>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </FormPageLayout>
  );
}
