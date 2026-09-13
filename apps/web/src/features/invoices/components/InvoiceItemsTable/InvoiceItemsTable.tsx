"use client";

import { useRef, type KeyboardEvent } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  function updateItem(index: number, value: InvoiceLineValue) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  // Quantity/Price are plain text inputs, so Enter has no default behavior to
  // preserve — it's repurposed to advance focus the same way Tab already
  // does. The product field is left alone: its Enter opens/confirms the
  // dropdown, which would be lost if we intercepted it here too.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" || !(event.target instanceof HTMLInputElement)) {
      return;
    }
    const container = containerRef.current;
    if (!container) return;

    const fields = Array.from(container.querySelectorAll<HTMLElement>("[data-invoice-nav]"));
    const currentIndex = fields.indexOf(event.target);
    if (currentIndex === -1 || currentIndex === fields.length - 1) {
      return;
    }

    event.preventDefault();
    fields[currentIndex + 1].focus();
  }

  return (
    <div className="flex flex-col gap-3">
      <div ref={containerRef} className="rounded-lg border border-border" onKeyDown={handleKeyDown}>
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
