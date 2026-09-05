"use client";

import { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DateDisplay } from "@/components/ui/DateDisplay";
import { Dropdown, DropdownContent, DropdownItem, DropdownLabel, DropdownSeparator, DropdownTrigger } from "@/components/ui/Dropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { toast } from "@/components/ui/Toast";
import { Heading, Text } from "@/components/ui/Typography";
import { FormField } from "@/components/forms/FormField";
import { SearchInput } from "@/components/forms/SearchInput";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { Pagination } from "@/components/tables/Pagination";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHeader } from "@/components/layout/PageHeader";
import { Toolbar } from "@/components/layout/Toolbar";

type SampleInvoice = {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  amount: number;
  status: "PAID" | "PARTIAL" | "UNPAID";
};

const sampleInvoices: SampleInvoice[] = [
  { id: "1", invoiceNumber: "INV-1042", customer: "ABC Traders", date: "2026-09-01", amount: 5000, status: "PAID" },
  { id: "2", invoiceNumber: "INV-1041", customer: "Rahul Kumar", date: "2026-08-28", amount: 2500, status: "PARTIAL" },
  { id: "3", invoiceNumber: "INV-1040", customer: "XYZ Distributors", date: "2026-08-27", amount: 8200, status: "UNPAID" },
];

const statusVariant: Record<SampleInvoice["status"], "success" | "warning" | "error"> = {
  PAID: "success",
  PARTIAL: "warning",
  UNPAID: "error",
};

const invoiceColumns: DataTableColumn<SampleInvoice>[] = [
  { id: "invoiceNumber", header: "Invoice", cell: (row) => row.invoiceNumber },
  { id: "customer", header: "Customer", cell: (row) => row.customer },
  { id: "date", header: "Date", cell: (row) => <DateDisplay value={row.date} /> },
  { id: "amount", header: "Amount", cell: (row) => <CurrencyDisplay value={row.amount} />, className: "text-right" },
  {
    id: "status",
    header: "Status",
    cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
  },
];

export default function StyleGuidePage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col gap-10 pb-10">
      <Breadcrumbs items={[{ label: "Style Guide" }]} />
      <PageHeader
        title="Style Guide"
        description="Internal reference for the shared component library. Not part of the product navigation."
      />

      <section className="flex flex-col gap-4">
        <Heading as="h2">Typography</Heading>
        <div className="flex flex-col gap-2">
          <Heading as="h1">Heading 1</Heading>
          <Heading as="h2">Heading 2</Heading>
          <Heading as="h3">Heading 3</Heading>
          <Heading as="h4">Heading 4</Heading>
          <Text>Default body text for general content.</Text>
          <Text variant="muted">Muted text for secondary information.</Text>
          <Text variant="small">Small text for captions and helper copy.</Text>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2">Buttons</Heading>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <IconButton aria-label="Add">
            <Plus className="size-4" />
          </IconButton>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2">Badges</Heading>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Paid</Badge>
          <Badge variant="warning">Partial</Badge>
          <Badge variant="error">Unpaid</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2">Form elements</Heading>
        <Card>
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
            <FormField label="Customer name" htmlFor="demo-name" required>
              <Input id="demo-name" placeholder="e.g. ABC Traders" />
            </FormField>
            <FormField label="Phone" htmlFor="demo-phone" error="Enter a valid 10-digit phone number.">
              <Input id="demo-phone" invalid placeholder="e.g. 9876543210" />
            </FormField>
            <FormField label="Unit" htmlFor="demo-unit">
              <Select defaultValue="piece">
                <SelectTrigger id="demo-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="litre">Litre</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Notes" htmlFor="demo-notes" description="Optional, shown on the printed invoice.">
              <Textarea id="demo-notes" placeholder="Add any notes" />
            </FormField>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Checkbox id="demo-active" defaultChecked />
              <Label htmlFor="demo-active">Active</Label>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2">Search &amp; toolbar</Heading>
        <Toolbar actions={<Button size="sm"><Plus />Add customer</Button>}>
          <SearchInput placeholder="Search customers..." />
        </Toolbar>
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2">Table, pagination &amp; row menu</Heading>
        <DataTable
          columns={[
            ...invoiceColumns,
            {
              id: "actions",
              header: "",
              className: "text-right",
              cell: () => (
                <Dropdown>
                  <DropdownTrigger asChild>
                    <IconButton aria-label="Row actions">
                      <MoreHorizontal className="size-4" />
                    </IconButton>
                  </DropdownTrigger>
                  <DropdownContent align="end">
                    <DropdownLabel>Actions</DropdownLabel>
                    <DropdownSeparator />
                    <DropdownItem>View invoice</DropdownItem>
                    <DropdownItem>Record payment</DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem className="text-destructive" onSelect={() => setConfirmOpen(true)}>
                      Delete
                    </DropdownItem>
                  </DropdownContent>
                </Dropdown>
              ),
            },
          ]}
          data={sampleInvoices}
          rowKey={(row) => row.id}
        />
        <Pagination page={page} totalPages={5} onPageChange={setPage} />
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2">Loading, empty &amp; error states</Heading>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Text variant="small">Loading</Text>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Text variant="small">Empty</Text>
            <EmptyState
              title="No customers yet."
              description="Add your first customer to get started."
              action={<Button size="sm"><Plus />Add customer</Button>}
            />
          </div>
          <div>
            <Text variant="small">Error</Text>
            <ErrorState description="We couldn't load this data." onRetry={() => toast.success("Retried")} />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2">Tabs</Heading>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Summary content goes here.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text variant="muted">Tab panel content.</Text>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ledger">
            <Text variant="muted">Ledger tab panel content.</Text>
          </TabsContent>
          <TabsContent value="invoices">
            <Text variant="muted">Invoices tab panel content.</Text>
          </TabsContent>
        </Tabs>
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2">Dialogs &amp; toasts</Heading>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Deactivate customer
          </Button>
          <Button variant="outline" onClick={() => toast.success("Invoice saved successfully.")}>
            Show success toast
          </Button>
          <Button variant="outline" onClick={() => toast.error("Insufficient stock for Product A.")}>
            Show error toast
          </Button>
        </div>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Deactivate this customer?"
          description="They will no longer appear in customer selectors, but their invoice and ledger history is kept."
          confirmLabel="Deactivate"
          destructive
          onConfirm={() => {
            setConfirmOpen(false);
            toast.success("Customer deactivated.");
          }}
        />
      </section>
    </div>
  );
}
