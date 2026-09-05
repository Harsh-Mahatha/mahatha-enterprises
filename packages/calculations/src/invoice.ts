import Decimal from "decimal.js";

export type InvoiceLineInput = {
  quantity: number | string;
  unitPrice: number | string;
};

export type InvoiceDiscountInput = {
  amount: number | string;
};

export type InvoiceCalculationInput = {
  items: InvoiceLineInput[];
  discounts: InvoiceDiscountInput[];
  paymentReceived: number | string;
};

export type InvoiceCalculationResult = {
  lineTotals: string[];
  subtotal: string;
  discountTotal: string;
  total: string;
  outstanding: string;
};

// The single canonical invoice calculation. The UI, the backend (which must
// always recalculate rather than trust client-submitted totals), and the
// print view all derive from this — never reimplemented separately.
export function calculateInvoice(input: InvoiceCalculationInput): InvoiceCalculationResult {
  const lineTotals = input.items.map((item) => new Decimal(item.quantity || 0).mul(item.unitPrice || 0));
  const subtotal = lineTotals.reduce((sum, value) => sum.plus(value), new Decimal(0));
  const discountTotal = input.discounts.reduce((sum, discount) => sum.plus(discount.amount || 0), new Decimal(0));
  const total = subtotal.minus(discountTotal);
  const outstanding = total.minus(new Decimal(input.paymentReceived || 0));

  return {
    lineTotals: lineTotals.map((value) => value.toFixed(2)),
    subtotal: subtotal.toFixed(2),
    discountTotal: discountTotal.toFixed(2),
    total: total.toFixed(2),
    outstanding: outstanding.toFixed(2),
  };
}

export type InvoiceCalculationIssue = {
  field: "discounts" | "paymentReceived";
  message: string;
};

// Deliberately separate from calculateInvoice: the calculation itself never
// throws or clamps, so callers can show live totals as the user types. The
// section 42 invariants (total >= 0, payment cannot exceed the total) are
// enforced here instead, at the point where a caller needs a pass/fail
// answer (inline form validation, or the backend rejecting a save).
export function validateInvoiceCalculation(result: InvoiceCalculationResult): InvoiceCalculationIssue[] {
  const issues: InvoiceCalculationIssue[] = [];

  if (new Decimal(result.total).isNegative()) {
    issues.push({ field: "discounts", message: "Discount cannot exceed the subtotal." });
  }

  if (new Decimal(result.outstanding).isNegative()) {
    issues.push({ field: "paymentReceived", message: "Payment received cannot exceed the invoice total." });
  }

  return issues;
}
