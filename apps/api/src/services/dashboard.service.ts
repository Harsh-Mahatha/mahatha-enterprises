import { isLowStock } from "@mahatha/calculations";
import { prisma } from "../config/prisma";

function getTodayRange() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

export async function getDashboardSummary() {
  const { start, end } = getTodayRange();

  const [todaysInvoices, openingBalanceSum, invoiceTotalSum, paymentAmountSum, totalCustomers, activeProducts, recentInvoices] =
    await Promise.all([
      prisma.invoice.aggregate({
        where: { date: { gte: start, lt: end } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.customer.aggregate({ _sum: { openingBalance: true } }),
      prisma.invoice.aggregate({ _sum: { total: true } }),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.customer.count({ where: { active: true } }),
      prisma.product.findMany({
        where: { active: true },
        select: { currentStock: true, minStockLevel: true },
      }),
      prisma.invoice.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { customer: true },
      }),
    ]);

  const lowStockCount = activeProducts.filter((product) =>
    isLowStock(product.currentStock.toString(), product.minStockLevel),
  ).length;

  // Total outstanding = opening balances + invoice totals - payments, summed
  // across all customers. This is mathematically the sum of each customer's
  // own (openingBalance + their invoices - their payments), since the ledger
  // is purely additive/subtractive per customer — no need to re-derive it
  // from each customer's latest ledger entry individually.
  const outstanding =
    Number(openingBalanceSum._sum.openingBalance ?? 0) +
    Number(invoiceTotalSum._sum.total ?? 0) -
    Number(paymentAmountSum._sum.amount ?? 0);

  return {
    todaysSales: Number(todaysInvoices._sum.total ?? 0).toFixed(2),
    todaysInvoiceCount: todaysInvoices._count,
    outstanding: outstanding.toFixed(2),
    totalCustomers,
    lowStockCount,
    recentInvoices,
  };
}
