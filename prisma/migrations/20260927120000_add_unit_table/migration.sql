-- CreateTable: the list of selectable product units, extendable from the app.
CREATE TABLE "Unit" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");

-- Seed the units that used to be the fixed ProductUnit enum.
INSERT INTO "Unit" ("id", "name") VALUES
    (gen_random_uuid(), 'Piece'),
    (gen_random_uuid(), 'Box'),
    (gen_random_uuid(), 'Kg'),
    (gen_random_uuid(), 'Litre'),
    (gen_random_uuid(), 'Meter');

-- AlterTable: Product.unit becomes free text holding the unit's name. Existing
-- enum values are converted to the matching display names above.
ALTER TABLE "Product" ALTER COLUMN "unit" TYPE TEXT USING (
    CASE "unit"::text
        WHEN 'PIECE' THEN 'Piece'
        WHEN 'BOX' THEN 'Box'
        WHEN 'KG' THEN 'Kg'
        WHEN 'LITRE' THEN 'Litre'
        WHEN 'METER' THEN 'Meter'
        ELSE "unit"::text
    END
);

-- DropEnum
DROP TYPE "ProductUnit";
