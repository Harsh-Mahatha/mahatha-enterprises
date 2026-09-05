"use client";

import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import * as productService from "@/services/api/products";

export type ProductSelectProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
};

export function ProductSelect({ id, value, onValueChange }: ProductSelectProps) {
  const { data } = useQuery({
    queryKey: ["products", "select-options"],
    queryFn: () => productService.listProducts({ pageSize: 100 }),
  });

  const products = (data?.items ?? []).filter((product) => product.active);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Select a product" />
      </SelectTrigger>
      <SelectContent>
        {products.map((product) => (
          <SelectItem key={product.id} value={product.id}>
            {product.name} ({product.sku})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
