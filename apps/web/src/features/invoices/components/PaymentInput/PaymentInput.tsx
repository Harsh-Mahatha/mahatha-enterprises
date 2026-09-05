"use client";

import type { PaymentMode } from "@mahatha/types";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

const modeOptions: { value: PaymentMode; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK", label: "Bank" },
  { value: "OTHER", label: "Other" },
];

export type PaymentInputProps = {
  amount: string;
  mode: PaymentMode;
  onAmountChange: (value: string) => void;
  onModeChange: (value: PaymentMode) => void;
};

export function PaymentInput({ amount, mode, onAmountChange, onModeChange }: PaymentInputProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Payment received" htmlFor="paymentReceived">
        <Input
          id="paymentReceived"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
        />
      </FormField>
      <FormField label="Payment mode" htmlFor="paymentMode">
        <Select value={mode} onValueChange={(value) => onModeChange(value as PaymentMode)}>
          <SelectTrigger id="paymentMode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {modeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    </div>
  );
}
