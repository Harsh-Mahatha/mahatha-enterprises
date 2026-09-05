import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";

export type CurrencyDisplayProps = {
  value: number;
  className?: string;
};

export function CurrencyDisplay({ value, className }: CurrencyDisplayProps) {
  return <span className={cn("tabular-nums", value < 0 && "text-destructive", className)}>{formatCurrency(value)}</span>;
}
