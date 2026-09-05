import type { ReactNode } from "react";

export type ReportSummaryItem = {
  label: string;
  value: ReactNode;
};

export type ReportSummaryProps = {
  items: ReportSummaryItem[];
};

export function ReportSummary({ items }: ReportSummaryProps) {
  return (
    <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</span>
          <span className="text-xl font-semibold">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
