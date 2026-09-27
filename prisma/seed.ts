import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEV_ADMIN_EMAIL = "admin@mahathaenterprises.example";
const DEV_ADMIN_PASSWORD = "password123";

async function main() {
  // Dev-only reset so this script is safe to re-run (FK-safe delete order).
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.customerLedgerEntry.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.invoiceDiscount.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.invoiceCounter.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.companySettings.deleteMany();

  await prisma.unit.deleteMany();
  await prisma.unit.createMany({
    data: ["Piece", "Box", "Kg", "Litre", "Meter"].map((name) => ({ name })),
  });

  await prisma.companySettings.create({
    data: {
      businessName: "Mahatha Enterprises",
      address: "H-17/348, Sangam Vihar, New Delhi - 110080",
      phone: "8748945421",
      email: "shrutimehta1847@gmail.com",
      invoicePrefix: "INV-",
    },
  });

  await prisma.user.create({
    data: {
      name: "Admin",
      email: DEV_ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(DEV_ADMIN_PASSWORD, 12),
    },
  });

  const customerSeeds = [
    { name: "ABC Traders", phone: "9876500001", openingBalance: 10000 },
    { name: "XYZ Distributors", phone: "9876500002", openingBalance: 0 },
    { name: "Rahul Kumar", phone: "9876500003", openingBalance: 5000 },
  ];

  for (const seed of customerSeeds) {
    const customer = await prisma.customer.create({
      data: {
        name: seed.name,
        phone: seed.phone,
        openingBalance: seed.openingBalance,
      },
    });

    if (seed.openingBalance !== 0) {
      await prisma.customerLedgerEntry.create({
        data: {
          customerId: customer.id,
          type: "OPENING_BALANCE",
          amount: seed.openingBalance,
          balanceAfter: seed.openingBalance,
          date: customer.createdAt,
        },
      });
    }
  }

  const productSeeds = [
    { name: "Product A", sku: "PROD-A", unit: "Piece", mrp: 1100, sellingPrice: 1000, minStockLevel: 10, stock: 100 },
    { name: "Product B", sku: "PROD-B", unit: "Piece", mrp: 550, sellingPrice: 500, minStockLevel: 10, stock: 150 },
    { name: "Product C", sku: "PROD-C", unit: "Piece", mrp: 275, sellingPrice: 250, minStockLevel: 10, stock: 5 },
  ];

  for (const seed of productSeeds) {
    const product = await prisma.product.create({
      data: {
        name: seed.name,
        sku: seed.sku,
        unit: seed.unit,
        mrp: seed.mrp,
        sellingPrice: seed.sellingPrice,
        minStockLevel: seed.minStockLevel,
        currentStock: seed.stock,
      },
    });

    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        type: "STOCK_ENTRY",
        quantity: seed.stock,
        balanceAfter: seed.stock,
        reason: "Initial stock",
        date: product.createdAt,
      },
    });
  }

  console.log("Seed complete.");
  console.log(`Dev login: ${DEV_ADMIN_EMAIL} / ${DEV_ADMIN_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
