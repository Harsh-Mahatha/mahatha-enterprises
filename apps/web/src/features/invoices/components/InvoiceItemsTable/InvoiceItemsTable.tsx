"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { InvoiceLine, type InvoiceLineValue } from "@/features/invoices/components/InvoiceLine";

export type InvoiceItemsTableProps = {
  items: InvoiceLineValue[];
  lineTotals: string[];
  onChange: (items: InvoiceLineValue[]) => void;
};

function emptyLine(): InvoiceLineValue {
  return { key: crypto.randomUUID(), productId: "", quantity: "1", unitPrice: "" };
}

export function InvoiceItemsTable({ items, lineTotals, onChange }: InvoiceItemsTableProps) {
  function updateItem(index: number, value: InvoiceLineValue) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <InvoiceLine
                key={item.key}
                value={item}
                lineTotal={lineTotals[index] ?? "0.00"}
                onChange={(value) => updateItem(index, value)}
                onRemove={() => removeItem(index)}
                removable={items.length > 1}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => onChange([...items, emptyLine()])}>
        <Plus />
        Add line
      </Button>
    </div>
  );
}
