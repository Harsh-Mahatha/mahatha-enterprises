import { paymentModeValues } from "@mahatha/validation";
import type { PaymentMode } from "@mahatha/types";

const labels: Record<PaymentMode, string> = {
  CASH: "Cash",
  UPI: "UPI",
  BANK: "Bank",
  OTHER: "Other",
};

export const paymentModeOptions: { value: PaymentMode; label: string }[] = paymentModeValues.map((value) => ({
  value,
  label: labels[value],
}));
