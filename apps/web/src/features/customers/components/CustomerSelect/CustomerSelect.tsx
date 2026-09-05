"use client";

import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import * as customerService from "@/services/api/customers";

// Radix Select reserves the empty string for "no selection", so an "all"
// option needs a real sentinel value that gets mapped back to "" here.
const ALL_VALUE = "__all__";

export type CustomerSelectProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  /** When set, adds a clearable "all customers" option with this label. */
  allowAllLabel?: string;
};

export function CustomerSelect({ id, value, onValueChange, allowAllLabel }: CustomerSelectProps) {
  const { data } = useQuery({
    queryKey: ["customers", "select-options"],
    queryFn: () => customerService.listCustomers({ pageSize: 100 }),
  });

  const customers = (data?.items ?? []).filter((customer) => customer.active);

  return (
    <Select
      value={value || (allowAllLabel ? ALL_VALUE : value)}
      onValueChange={(next) => onValueChange(next === ALL_VALUE ? "" : next)}
    >
      <SelectTrigger id={id}>
        <SelectValue placeholder="Select a customer" />
      </SelectTrigger>
      <SelectContent>
        {allowAllLabel ? <SelectItem value={ALL_VALUE}>{allowAllLabel}</SelectItem> : null}
        {customers.map((customer) => (
          <SelectItem key={customer.id} value={customer.id}>
            {customer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
