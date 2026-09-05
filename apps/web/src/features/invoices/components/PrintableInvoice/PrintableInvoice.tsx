import type { CompanySettings, Invoice } from "@mahatha/types";
import { getInvoiceOutstanding } from "@mahatha/calculations";
import { formatCurrency, formatDate } from "@/utils/format";

export type PrintableInvoiceProps = {
  invoice: Invoice;
  companySettings: CompanySettings;
};

// A dedicated, self-contained print layout — deliberately not composed from
// the app's themed UI atoms. It must render the same black-on-white way
// regardless of the viewer's light/dark preference, since that's what ends
// up on paper.
export function PrintableInvoice({ invoice, companySettings }: PrintableInvoiceProps) {
  const outstanding = Number(getInvoiceOutstanding(invoice));

  return (
    <div className="bg-white text-black">
      <InvoiceHeader companySettings={companySettings} invoice={invoice} />
      <CustomerDetails invoice={invoice} />
      <InvoiceItems invoice={invoice} />
      <DiscountSummary invoice={invoice} />
      <div className="mt-6 flex justify-end">
        <div className="w-64">
          <InvoiceTotals invoice={invoice} />
          <PaymentSummary invoice={invoice} outstanding={outstanding} />
        </div>
      </div>
      {invoice.notes ? (
        <div className="mt-8 border-t border-gray-300 pt-4 text-sm">
          <p className="font-medium">Notes</p>
          <p className="text-gray-700">{invoice.notes}</p>
        </div>
      ) : null}
      <InvoiceFooter />
    </div>
  );
}

function InvoiceHeader({ companySettings, invoice }: { companySettings: CompanySettings; invoice: Invoice }) {
  return (
    <div className="flex items-start justify-between border-b border-gray-300 pb-6">
      <div>
        {companySettings.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- print output, not a routed app page
          <img
            src={companySettings.logoUrl}
            alt={companySettings.businessName}
            className="mb-2 h-12 object-contain"
          />
        ) : null}
        <p className="text-lg font-semibold">{companySettings.businessName}</p>
        {companySettings.address ? <p className="text-sm text-gray-700">{companySettings.address}</p> : null}
        {companySettings.phone || companySettings.email ? (
          <p className="text-sm text-gray-700">
            {[companySettings.phone, companySettings.email].filter(Boolean).join(" · ")}
          </p>
        ) : null}
      </div>
      <div className="text-right">
        <p className="text-xl font-bold tracking-wide">INVOICE</p>
        <p className="text-sm text-gray-700">{invoice.invoiceNumber}</p>
        <p className="text-sm text-gray-700">{formatDate(invoice.date)}</p>
      </div>
    </div>
  );
}

function CustomerDetails({ invoice }: { invoice: Invoice }) {
  return (
    <div className="mt-6">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Billed to</p>
      <p className="font-medium">{invoice.customer?.name ?? "—"}</p>
      {invoice.customer?.address ? <p className="text-sm text-gray-700">{invoice.customer.address}</p> : null}
      {invoice.customer?.phone ? <p className="text-sm text-gray-700">{invoice.customer.phone}</p> : null}
    </div>
  );
}

function InvoiceItems({ invoice }: { invoice: Invoice }) {
  return (
    <table className="mt-6 w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-gray-400 text-left">
          <th className="py-2 font-medium">Product</th>
          <th className="py-2 text-right font-medium">Qty</th>
          <th className="py-2 text-right font-medium">Rate</th>
          <th className="py-2 text-right font-medium">Amount</th>
        </tr>
      </thead>
      <tbody>
        {(invoice.items ?? []).map((item) => (
          <tr key={item.id} className="border-b border-gray-200">
            <td className="py-2">{item.product?.name ?? "—"}</td>
            <td className="py-2 text-right">{item.quantity}</td>
            <td className="py-2 text-right">{formatCurrency(Number(item.unitPrice))}</td>
            <td className="py-2 text-right">{formatCurrency(Number(item.lineTotal))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DiscountSummary({ invoice }: { invoice: Invoice }) {
  const discounts = invoice.discounts ?? [];
  if (discounts.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 text-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Discounts</p>
      {discounts.map((discount) => (
        <div key={discount.id} className="flex justify-between py-0.5">
          <span className="text-gray-700">{discount.description || "Discount"}</span>
          <span>-{formatCurrency(Number(discount.amount))}</span>
        </div>
      ))}
    </div>
  );
}

function InvoiceTotals({ invoice }: { invoice: Invoice }) {
  return (
    <div className="text-sm">
      <div className="flex justify-between py-1">
        <span className="text-gray-600">Subtotal</span>
        <span>{formatCurrency(Number(invoice.subtotal))}</span>
      </div>
      {Number(invoice.discountTotal) > 0 ? (
        <div className="flex justify-between py-1">
          <span className="text-gray-600">Discount</span>
          <span>-{formatCurrency(Number(invoice.discountTotal))}</span>
        </div>
      ) : null}
      <div className="flex justify-between border-t border-gray-400 py-1 text-base font-semibold">
        <span>Total</span>
        <span>{formatCurrency(Number(invoice.total))}</span>
      </div>
    </div>
  );
}

function PaymentSummary({ invoice, outstanding }: { invoice: Invoice; outstanding: number }) {
  return (
    <div className="mt-2 text-sm">
      <div className="flex justify-between py-1">
        <span className="text-gray-600">Payment received</span>
        <span>{formatCurrency(Number(invoice.amountPaid))}</span>
      </div>
      <div className="flex justify-between border-t border-gray-400 py-1 font-semibold">
        <span>Outstanding</span>
        <span>{formatCurrency(outstanding)}</span>
      </div>
    </div>
  );
}

function InvoiceFooter() {
  return (
    <div className="mt-10 border-t border-gray-300 pt-4 text-center text-xs text-gray-500">
      <p>Thank you for your business.</p>
    </div>
  );
}
