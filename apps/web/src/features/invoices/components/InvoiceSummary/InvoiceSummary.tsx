import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";

export type InvoiceSummaryProps = {
  subtotal: string;
  discountTotal: string;
  total: string;
  outstanding: string;
};

export function InvoiceSummary({ subtotal, discountTotal, total, outstanding }: InvoiceSummaryProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <CurrencyDisplay value={Number(subtotal)} />
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Discount</span>
        <span className="flex items-center gap-1">
          <span>-</span>
          <CurrencyDisplay value={Number(discountTotal)} />
        </span>
      </div>
      <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
        <span>Total</span>
        <CurrencyDisplay value={Number(total)} />
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Outstanding</span>
        <CurrencyDisplay value={Number(outstanding)} />
      </div>
    </div>
  );
}
