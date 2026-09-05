-- DropIndex
DROP INDEX "CustomerLedgerEntry_customerId_date_idx";

-- CreateIndex
CREATE INDEX "CustomerLedgerEntry_customerId_createdAt_idx" ON "CustomerLedgerEntry"("customerId", "createdAt");
