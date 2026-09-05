-- CreateTable
CREATE TABLE "InvoiceCounter" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InvoiceCounter_pkey" PRIMARY KEY ("id")
);
