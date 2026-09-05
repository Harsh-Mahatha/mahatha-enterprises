import Link from "next/link";
import type { Payment, PaymentMode } from "@mahatha/types";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DateDisplay } from "@/components/ui/DateDisplay";
import { DescriptionItem } from "@/components/ui/DescriptionItem";

const modeLabel: Record<PaymentMode, string> = {
  CASH: "Cash",
  UPI: "UPI",
  BANK: "Bank",
  OTHER: "Other",
};

export type PaymentSummaryProps = {
  payment: Payment;
};

export function PaymentSummary({ payment }: PaymentSummaryProps) {
  return (
    <Card>
      <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
        <DescriptionItem label="Customer">
          {payment.customer ? (
            <Link href={`/customers/${payment.customerId}`} className="hover:underline">
              {payment.customer.name}
            </Link>
          ) : (
            "—"
          )}
        </DescriptionItem>
        <DescriptionItem label="Amount">
          <CurrencyDisplay value={Number(payment.amount)} />
        </DescriptionItem>
        <DescriptionItem label="Date">
          <DateDisplay value={payment.date} />
        </DescriptionItem>
        <DescriptionItem label="Mode">
          <Badge variant="outline">{modeLabel[payment.mode]}</Badge>
        </DescriptionItem>
        <DescriptionItem label="Reference">{payment.reference ?? "—"}</DescriptionItem>
        <DescriptionItem label="Notes" className="sm:col-span-2">
          {payment.notes ?? "—"}
        </DescriptionItem>
      </CardContent>
    </Card>
  );
}
