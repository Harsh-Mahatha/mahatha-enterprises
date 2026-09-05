"use client";

import { Input } from "@/components/ui/Input";

export type DateRangeValue = {
  dateFrom: string;
  dateTo: string;
};

export type DateRangeFilterProps = {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
};

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        type="date"
        value={value.dateFrom}
        onChange={(event) => onChange({ ...value, dateFrom: event.target.value })}
        className="w-40"
        aria-label="From date"
      />
      <span className="text-sm text-muted-foreground">to</span>
      <Input
        type="date"
        value={value.dateTo}
        onChange={(event) => onChange({ ...value, dateTo: event.target.value })}
        className="w-40"
        aria-label="To date"
      />
    </div>
  );
}
