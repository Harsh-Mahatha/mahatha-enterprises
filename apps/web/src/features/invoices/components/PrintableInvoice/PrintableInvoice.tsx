import type { CompanySettings, Invoice, InvoiceItem, InvoiceStatus } from "@mahatha/types";
import { getInvoiceOutstanding } from "@mahatha/calculations";
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

// Every page-block is exactly half of A4's printable height: 297mm minus the
// 0.75cm @page margin top and bottom (see globals.css), halved. The height is
// fixed regardless of how many rows a block holds, so a short final block
// looks the same as a full one.
const BLOCK_HEIGHT_CLASS = "h-[135mm]";

// Row budgets that fit inside that height at the compact 10px type scale used
// below (an item row is ~4.6mm). Continuation blocks only carry the
// "continued" footer, so they hold more rows than the last block, which also
// carries the totals, amount-in-words and signature. The last block's budget
// shrinks further for each discount line and for notes (see getLastPageCapacity).
// If the type scale or paddings change, re-check these against a printout.
const ITEMS_PER_FULL_PAGE = 18;
const ITEMS_ON_LAST_PAGE = 13;

function getLastPageCapacity(invoice: Invoice): number {
  const extraLines = (invoice.discounts?.length ?? 0) + (invoice.notes ? 1 : 0);
  return Math.max(1, ITEMS_ON_LAST_PAGE - extraLines);
}

// Fills continuation blocks first, then splits what's left so the last block
// never exceeds its (smaller) capacity. When the remainder would fit on one
// full page but not on the last one, it's split roughly in half instead of
// leaving a last block with only totals.
function paginate<T>(items: T[], lastPageCapacity: number): T[][] {
  const pages: T[][] = [];
  let index = 0;
  while (items.length - index > lastPageCapacity) {
    const remaining = items.length - index;
    const take =
      remaining > ITEMS_PER_FULL_PAGE
        ? ITEMS_PER_FULL_PAGE
        : remaining - Math.min(lastPageCapacity, Math.ceil(remaining / 2));
    pages.push(items.slice(index, index + take));
    index += take;
  }
  pages.push(items.slice(index));
  return pages;
}

// A dedicated, self-contained print layout — deliberately not composed from
// the app's themed UI atoms. It must render the same black-on-white way
// regardless of the viewer's light/dark preference, since that's what ends
// up on paper. Modelled on a bordered, tabular invoice format (boxed header,
// ruled item table, boxed totals) rather than the app's usual card style.
//
// Long item lists are paginated rather than left to grow the box taller:
// each page-block is a fixed-height column that repeats the header/customer
// details, with totals/amount-in-words/signature only on the last one. The
// item area flexes to fill the leftover height, so the footer sits at the
// bottom of the block however few rows it has.
export function PrintableInvoice({ invoice, companySettings }: PrintableInvoiceProps) {
  const outstanding = Number(getInvoiceOutstanding(invoice));
  const pages = paginate(invoice.items ?? [], getLastPageCapacity(invoice));
  const pageStartIndexes = pages.map((_, pageIndex) =>
    pages.slice(0, pageIndex).reduce((count, page) => count + page.length, 0),
  );

  return (
    <>
      {pages.map((pageItems, pageIndex) => {
        const isLastPage = pageIndex === pages.length - 1;
        const pageStartIndex = pageStartIndexes[pageIndex];
        return (
          <div
            key={pageIndex}
            className={`invoice-page-block mb-6 flex ${BLOCK_HEIGHT_CLASS} flex-col border border-black bg-white text-[10px] leading-tight text-black last:mb-0`}
          >
            <InvoiceHeader companySettings={companySettings} invoice={invoice} />
            <CustomerDetails invoice={invoice} />
            <div className="flex-1">
              <InvoiceItems items={pageItems} startIndex={pageStartIndex} />
            </div>
            {isLastPage ? (
              <>
                <InvoiceSummary invoice={invoice} outstanding={outstanding} />
                {invoice.notes ? (
                  <div className="border-b border-black px-1.5 py-0.5">
                    <span className="font-semibold">Notes: </span>
                    {invoice.notes}
                  </div>
                ) : null}
                <SignatureBlock />
              </>
            ) : (
              <p className="border-b border-black px-1.5 py-0.5 italic text-gray-600">Continued on next page…</p>
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
      <div className="flex-1 p-1.5">
        {companySettings.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- print output, not a routed app page
          <img
            src={companySettings.logoUrl}
            alt={companySettings.businessName}
            className="mb-0.5 h-6 object-contain"
          />
        ) : null}
        <p className="text-sm font-bold uppercase tracking-wide">{companySettings.businessName}</p>
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
      <div className="w-44 shrink-0 border-l border-black p-1.5 text-right">
        <p className="text-sm font-bold tracking-wide">INVOICE</p>
        <p className="mt-0.5">
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
      <div className="flex-1 p-1.5">
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
      <div className="w-44 shrink-0 border-l border-black p-1.5 text-right">
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
          <th className="border-b border-black px-1.5 py-0.5 text-left font-medium">S.No</th>
          <th className="border-b border-black px-1.5 py-0.5 text-left font-medium">Goods / Services supplied</th>
          <th className="border-b border-black px-1.5 py-0.5 text-right font-medium">Qty.</th>
          <th className="border-b border-black px-1.5 py-0.5 text-left font-medium">Unit</th>
          <th className="border-b border-black px-1.5 py-0.5 text-right font-medium">MRP (₹)</th>
          <th className="border-b border-black px-1.5 py-0.5 text-right font-medium">Rate (₹)</th>
          <th className="border-b border-black px-1.5 py-0.5 text-right font-medium">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={item.id}>
            <td className="border-b border-gray-300 px-1.5 py-0.5">{startIndex + index + 1}</td>
            <td className="border-b border-gray-300 px-1.5 py-0.5">{item.product?.name ?? "—"}</td>
            <td className="border-b border-gray-300 px-1.5 py-0.5 text-right">{item.quantity}</td>
            <td className="border-b border-gray-300 px-1.5 py-0.5">
              {item.product?.unit ?? "—"}
            </td>
            <td className="border-b border-gray-300 px-1.5 py-0.5 text-right">
              {formatCurrency(Number(item.mrp))}
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
      <div className="flex-1 p-1.5">
        <p>
          <span className="font-semibold">Amount in words : </span>
          {formatAmountInWords(Number(invoice.total))}
        </p>
        {discounts.length > 0 ? (
          <div className="mt-0.5">
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
      <div className="w-44 shrink-0 border-l border-black">
        <div className="flex justify-between border-b border-gray-300 px-1.5 py-0.5">
          <span className="font-semibold">Grand Total</span>
          <span className="font-semibold">{formatCurrency(Number(invoice.total))}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 px-1.5 py-0.5">
          <span>Payment Received</span>
          <span>{formatCurrency(Number(invoice.amountPaid))}</span>
        </div>
        <div className="flex justify-between bg-gray-100 px-1.5 py-0.5">
          <span className="font-semibold">Outstanding</span>
          <span className="font-semibold">{formatCurrency(outstanding)}</span>
        </div>
      </div>
    </div>
  );
}

function SignatureBlock() {
  return (
    <div className="flex items-end justify-between p-1.5 pt-5">
      <p>Receiver&apos;s Signature</p>
      <div className="text-right">
        <p className="w-32 border-t border-black pt-0.5">Authorised Signatory</p>
      </div>
    </div>
  );
}
