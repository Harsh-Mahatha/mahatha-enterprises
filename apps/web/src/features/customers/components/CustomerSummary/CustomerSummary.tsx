import type { Customer } from "@mahatha/types";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DateDisplay } from "@/components/ui/DateDisplay";
import { DescriptionItem } from "@/components/ui/DescriptionItem";

export type CustomerSummaryProps = {
  customer: Customer;
};

export function CustomerSummary({ customer }: CustomerSummaryProps) {
  return (
    <Card>
      <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
        <DescriptionItem label="Phone">{customer.phone ?? "—"}</DescriptionItem>
        <DescriptionItem label="Email">{customer.email ?? "—"}</DescriptionItem>
        <DescriptionItem label="Address" className="sm:col-span-2">
          {customer.address ?? "—"}
        </DescriptionItem>
        <DescriptionItem label="Opening balance">
          <CurrencyDisplay value={Number(customer.openingBalance)} />
        </DescriptionItem>
        <DescriptionItem label="Status">
          <Badge variant={customer.active ? "success" : "default"}>
            {customer.active ? "Active" : "Inactive"}
          </Badge>
        </DescriptionItem>
        <DescriptionItem label="Customer since">
          <DateDisplay value={customer.createdAt} />
        </DescriptionItem>
      </CardContent>
    </Card>
  );
}
