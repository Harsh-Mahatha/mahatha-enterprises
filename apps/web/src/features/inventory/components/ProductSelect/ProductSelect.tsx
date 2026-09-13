"use client";

import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import * as productService from "@/services/api/products";

// Radix Select reserves the empty string for "no selection", so an "all"
// option needs a real sentinel value that gets mapped back to "" here.
const ALL_VALUE = "__all__";

export type ProductSelectProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  /** When set, adds a clearable "all products" option with this label. */
  allowAllLabel?: string;
  /** Marks the trigger as a stop for the invoice items table's Enter-to-next-field navigation. */
  fieldNav?: boolean;
};

export function ProductSelect({ id, value, onValueChange, allowAllLabel, fieldNav }: ProductSelectProps) {
  const { data } = useQuery({
    queryKey: ["products", "select-options"],
    queryFn: () => productService.listProducts({ pageSize: 100 }),
  });

  const products = (data?.items ?? []).filter((product) => product.active);

  return (
    <Select
      value={value || (allowAllLabel ? ALL_VALUE : value)}
      onValueChange={(next) => onValueChange(next === ALL_VALUE ? "" : next)}
    >
      <SelectTrigger id={id} data-invoice-nav={fieldNav ? "true" : undefined}>
        <SelectValue placeholder="Select a product" />
      </SelectTrigger>
      <SelectContent>
        {allowAllLabel ? <SelectItem value={ALL_VALUE}>{allowAllLabel}</SelectItem> : null}
        {products.map((product) => (
          <SelectItem key={product.id} value={product.id}>
            {product.name} ({product.sku})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
