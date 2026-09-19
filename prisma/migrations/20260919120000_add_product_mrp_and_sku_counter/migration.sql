-- AlterTable: Product.mrp. Existing products have no MRP recorded, so it is
-- backfilled with their selling price and can be corrected per product.
ALTER TABLE "Product" ADD COLUMN "mrp" DECIMAL(12,2);
UPDATE "Product" SET "mrp" = "sellingPrice";
ALTER TABLE "Product" ALTER COLUMN "mrp" SET NOT NULL;

-- AlterTable: InvoiceItem.mrp. Existing invoice lines are backfilled with the
-- price actually charged, so old invoices don't claim an MRP that was never recorded.
ALTER TABLE "InvoiceItem" ADD COLUMN "mrp" DECIMAL(12,2);
UPDATE "InvoiceItem" SET "mrp" = "unitPrice";
ALTER TABLE "InvoiceItem" ALTER COLUMN "mrp" SET NOT NULL;

-- CreateTable
CREATE TABLE "SkuCounter" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SkuCounter_pkey" PRIMARY KEY ("id")
);
