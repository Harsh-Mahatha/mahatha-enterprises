"use client";

import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { TableCell, TableRow } from "@/components/ui/Table";
import { ProductSelect } from "@/features/inventory/components/ProductSelect";
import * as productService from "@/services/api/products";

export type InvoiceLineValue = {
  key: string;
  productId: string;
  quantity: string;
  unitPrice: string;
};

export type InvoiceLineProps = {
  value: InvoiceLineValue;
  lineTotal: string;
  onChange: (value: InvoiceLineValue) => void;
  onRemove: () => void;
  removable: boolean;
};

export function InvoiceLine({ value, lineTotal, onChange, onRemove, removable }: InvoiceLineProps) {
  const { data } = useQuery({
    queryKey: ["products", "select-options"],
    queryFn: () => productService.listProducts({ pageSize: 100 }),
  });

  function handleProductChange(productId: string) {
    const product = data?.items.find((item) => item.id === productId);
    onChange({
      ...value,
      productId,
      unitPrice: product ? product.sellingPrice : value.unitPrice,
    });
  }

  return (
    <TableRow>
      <TableCell className="min-w-[220px]">
        <ProductSelect value={value.productId} onValueChange={handleProductChange} fieldNav />
      </TableCell>
      <TableCell className="w-28">
        <Input
          type="number"
          step="0.001"
          min="0"
          value={value.quantity}
          onChange={(event) => onChange({ ...value, quantity: event.target.value })}
          data-invoice-nav="true"
        />
      </TableCell>
      <TableCell className="w-32">
        <Input
          type="number"
          step="0.01"
          min="0"
          value={value.unitPrice}
          onChange={(event) => onChange({ ...value, unitPrice: event.target.value })}
          data-invoice-nav="true"
        />
      </TableCell>
      <TableCell className="w-32 text-right">
        <CurrencyDisplay value={Number(lineTotal)} />
      </TableCell>
      <TableCell className="w-12">
        <IconButton aria-label="Remove line" onClick={onRemove} disabled={!removable}>
          <X className="size-4" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
