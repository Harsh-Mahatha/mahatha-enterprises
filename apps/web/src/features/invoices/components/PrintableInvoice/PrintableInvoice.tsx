import type { CompanySettings, Invoice, InvoiceItem, InvoiceStatus } from "@mahatha/types";
import { getInvoiceOutstanding } from "@mahatha/calculations";
import { productUnitLabels } from "@/constants/product-units";
import { formatAmountInWords, formatCurrency, formatDate } from "@/utils/format";

export type PrintableInvoiceProps = {
  invoice: Invoice;
  companySettings: CompanySettings;
};

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  PAID: "Paid",
  PARTIAL: "Partially Paid",
  UNPAID: "Unpaid",
};

// Kept low enough that a page (header + this many rows + totals/signature on
// the last one) stays within roughly half an A4 page — see globals.css for
// the matching @page margin and the page-break rule between blocks.
const ITEMS_PER_PAGE = 12;

function chunk<T>(items: T[], size: number): T[][] {
  if (items.length === 0) return [[]];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

// A dedicated, self-contained print layout — deliberately not composed from
// the app's themed UI atoms. It must render the same black-on-white way
// regardless of the viewer's light/dark preference, since that's what ends
// up on paper. Modelled on a bordered, tabular invoice format (boxed header,
// ruled item table, boxed totals) rather than the app's usual card style.
//
// Long item lists are paginated rather than left to grow the box taller:
// each page-block repeats the header/customer details and holds up to
// ITEMS_PER_PAGE rows, with totals/amount-in-words/signature only on the
// last one.
export function PrintableInvoice({ invoice, companySettings }: PrintableInvoiceProps) {
  const outstanding = Number(getInvoiceOutstanding(invoice));
  const pages = chunk(invoice.items ?? [], ITEMS_PER_PAGE);

  return (
    <>
      {pages.map((pageItems, pageIndex) => {
        const isLastPage = pageIndex === pages.length - 1;
        return (
          <div
            key={pageIndex}
            className="invoice-page-block mb-6 border border-black bg-white text-xs text-black last:mb-0"
          >
            <InvoiceHeader companySettings={companySettings} invoice={invoice} />
            <CustomerDetails invoice={invoice} />
            <InvoiceItems items={pageItems} startIndex={pageIndex * ITEMS_PER_PAGE} />
            {isLastPage ? (
              <>
                <InvoiceSummary invoice={invoice} outstanding={outstanding} />
                {invoice.notes ? (
                  <div className="border-b border-black px-2 py-1">
                    <span className="font-semibold">Notes: </span>
                    {invoice.notes}
                  </div>
                ) : null}
                <SignatureBlock />
              </>
            ) : (
              <p className="border-b border-black px-2 py-1 italic text-gray-600">Continued on next page…</p>
            )}
          </div>
        );
      })}
    </>
  );
}

function InvoiceHeader({ companySettings, invoice }: { companySettings: CompanySettings; invoice: Invoice }) {
  return (
    <div className="flex items-stretch justify-between border-b border-black">
      <div className="flex-1 p-2">
        {companySettings.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- print output, not a routed app page
          <img
            src={companySettings.logoUrl}
            alt={companySettings.businessName}
            className="mb-1 h-8 object-contain"
          />
        ) : null}
        <p className="text-lg font-bold uppercase tracking-wide">{companySettings.businessName}</p>
        {companySettings.address ? <p className="mt-0.5">{companySettings.address}</p> : null}
        {companySettings.phone || companySettings.email ? (
          <p>
            {[
              companySettings.phone ? `Tel: ${companySettings.phone}` : null,
              companySettings.email ? `Email: ${companySettings.email}` : null,
            ]
              .filter(Boolean)
              .join("  |  ")}
          </p>
        ) : null}
      </div>
      <div className="w-48 shrink-0 border-l border-black p-2 text-right">
        <p className="text-lg font-bold tracking-wide">INVOICE</p>
        <p className="mt-1">
          Invoice No : <span className="font-semibold">{invoice.invoiceNumber}</span>
        </p>
        <p>
          Date : <span className="font-semibold">{formatDate(invoice.date)}</span>
        </p>
      </div>
    </div>
  );
}

function CustomerDetails({ invoice }: { invoice: Invoice }) {
  return (
    <div className="flex items-stretch justify-between border-b border-black">
      <div className="flex-1 p-2">
        <p>
          <span className="font-semibold">Billed to : </span>
          {invoice.customer?.name ?? "—"}
        </p>
        {invoice.customer?.address ? (
          <p>
            <span className="font-semibold">Address : </span>
            {invoice.customer.address}
          </p>
        ) : null}
        {invoice.customer?.phone ? <p>{invoice.customer.phone}</p> : null}
      </div>
      <div className="w-48 shrink-0 border-l border-black p-2 text-right">
        <p>
          <span className="font-semibold">Status : </span>
          {STATUS_LABELS[invoice.status]}
        </p>
      </div>
    </div>
  );
}

function InvoiceItems({ items, startIndex }: { items: InvoiceItem[]; startIndex: number }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="border-b border-black px-1.5 py-1 text-left font-medium">S.No</th>
          <th className="border-b border-black px-1.5 py-1 text-left font-medium">Goods / Services supplied</th>
          <th className="border-b border-black px-1.5 py-1 text-right font-medium">Qty.</th>
          <th className="border-b border-black px-1.5 py-1 text-left font-medium">Unit</th>
          <th className="border-b border-black px-1.5 py-1 text-right font-medium">Rate (₹)</th>
          <th className="border-b border-black px-1.5 py-1 text-right font-medium">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={item.id}>
            <td className="border-b border-gray-300 px-1.5 py-0.5">{startIndex + index + 1}</td>
            <td className="border-b border-gray-300 px-1.5 py-0.5">{item.product?.name ?? "—"}</td>
            <td className="border-b border-gray-300 px-1.5 py-0.5 text-right">{item.quantity}</td>
            <td className="border-b border-gray-300 px-1.5 py-0.5">
              {item.product?.unit ? productUnitLabels[item.product.unit] : "—"}
            </td>
            <td className="border-b border-gray-300 px-1.5 py-0.5 text-right">
              {formatCurrency(Number(item.unitPrice))}
            </td>
            <td className="border-b border-gray-300 px-1.5 py-0.5 text-right">
              {formatCurrency(Number(item.lineTotal))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InvoiceSummary({ invoice, outstanding }: { invoice: Invoice; outstanding: number }) {
  const discounts = invoice.discounts ?? [];

  return (
    <div className="flex items-stretch justify-between border-b border-black">
      <div className="flex-1 p-2">
        <p>
          <span className="font-semibold">Amount in words : </span>
          {formatAmountInWords(Number(invoice.total))}
        </p>
        {discounts.length > 0 ? (
          <div className="mt-1">
            <p className="font-semibold">Discounts</p>
            {discounts.map((discount) => (
              <div key={discount.id} className="flex justify-between gap-4">
                <span>{discount.description || "Discount"}</span>
                <span>-{formatCurrency(Number(discount.amount))}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="w-48 shrink-0 border-l border-black">
        <div className="flex justify-between border-b border-gray-300 px-1.5 py-1">
          <span className="font-semibold">Grand Total</span>
          <span className="font-semibold">{formatCurrency(Number(invoice.total))}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 px-1.5 py-1">
          <span>Payment Received</span>
          <span>{formatCurrency(Number(invoice.amountPaid))}</span>
        </div>
        <div className="flex justify-between bg-gray-100 px-1.5 py-1">
          <span className="font-semibold">Outstanding</span>
          <span className="font-semibold">{formatCurrency(outstanding)}</span>
        </div>
      </div>
    </div>
  );
}

function SignatureBlock() {
  return (
    <div className="flex items-end justify-between p-2 pt-6">
      <p>Receiver&apos;s Signature</p>
      <div className="text-right">
        <p className="w-36 border-t border-black pt-0.5">Authorised Signatory</p>
      </div>
    </div>
  );
}
