"use client";

import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import * as customerService from "@/services/api/customers";

export type CustomerSelectProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
};

export function CustomerSelect({ id, value, onValueChange }: CustomerSelectProps) {
  const { data } = useQuery({
    queryKey: ["customers", "select-options"],
    queryFn: () => customerService.listCustomers({ pageSize: 100 }),
  });

  const customers = (data?.items ?? []).filter((customer) => customer.active);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Select a customer" />
      </SelectTrigger>
      <SelectContent>
        {customers.map((customer) => (
          <SelectItem key={customer.id} value={customer.id}>
            {customer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
