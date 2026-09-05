"use client";

import { X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";

export type DiscountLineValue = {
  key: string;
  description: string;
  amount: string;
};

export type DiscountLineProps = {
  value: DiscountLineValue;
  onChange: (value: DiscountLineValue) => void;
  onRemove: () => void;
};

export function DiscountLine({ value, onChange, onRemove }: DiscountLineProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Description (optional)"
        value={value.description}
        onChange={(event) => onChange({ ...value, description: event.target.value })}
        className="flex-1"
      />
      <Input
        type="number"
        step="0.01"
        min="0"
        placeholder="Amount"
        value={value.amount}
        onChange={(event) => onChange({ ...value, amount: event.target.value })}
        className="w-32"
      />
      <IconButton aria-label="Remove discount" onClick={onRemove}>
        <X className="size-4" />
      </IconButton>
    </div>
  );
}
