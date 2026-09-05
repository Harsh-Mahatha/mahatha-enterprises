import type { SalesReportQuery, StockMovementReportQuery } from "@mahatha/validation";
import { isLowStock } from "@mahatha/calculations";
import * as customerRepository from "../repositories/customer.repository";
import * as invoiceRepository from "../repositories/invoice.repository";
import * as ledgerRepository from "../repositories/ledger.repository";
import * as productRepository from "../repositories/product.repository";
import * as stockMovementRepository from "../repositories/stock-movement.repository";

export async function getSalesReport(query: SalesReportQuery) {
  const skip = (query.page - 1) * query.pageSize;
  const filterParams = {
    customerId: query.customerId,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  };

  const [[items, totalItems], aggregate] = await Promise.all([
    invoiceRepository.findInvoices({ ...filterParams, skip, take: query.pageSize }),
    invoiceRepository.aggregateInvoices(filterParams),
  ]);

  const totalSales = Number(aggregate._sum.total ?? 0);
  const totalPaid = Number(aggregate._sum.amountPaid ?? 0);

  return {
    items,
    summary: {
      totalInvoices: totalItems,
      totalSales: totalSales.toFixed(2),
      totalOutstanding: (totalSales - totalPaid).toFixed(2),
    },
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / query.pageSize)),
    },
  };
}

export async function getOutstandingReport() {
  const customers = await customerRepository.findAllCustomers();

  const withOutstanding = await Promise.all(
    customers.map(async (customer) => {
      const lastEntry = await ledgerRepository.findLatestLedgerEntry(customer.id);
      const outstanding = lastEntry ? Number(lastEntry.balanceAfter) : Number(customer.openingBalance);
      return { customerId: customer.id, customerName: customer.name, outstanding };
    }),
  );

  const items = withOutstanding
    .filter((item) => item.outstanding > 0)
    .sort((a, b) => b.outstanding - a.outstanding);

  const totalOutstanding = items.reduce((sum, item) => sum + item.outstanding, 0);

  return {
    items: items.map((item) => ({ ...item, outstanding: item.outstanding.toFixed(2) })),
    summary: {
      totalCustomers: items.length,
      totalOutstanding: totalOutstanding.toFixed(2),
    },
  };
}

export async function getStockReport() {
  const products = await productRepository.findAllActiveProducts();

  const items = products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    unit: product.unit,
    currentStock: product.currentStock.toString(),
    minStockLevel: product.minStockLevel,
    lowStock: isLowStock(product.currentStock.toString(), product.minStockLevel),
  }));

  return {
    items,
    summary: {
      totalProducts: items.length,
      lowStockCount: items.filter((item) => item.lowStock).length,
    },
  };
}

export async function getStockMovementReport(query: StockMovementReportQuery) {
  const skip = (query.page - 1) * query.pageSize;
  const [items, totalItems] = await stockMovementRepository.findStockMovements({
    productId: query.productId,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
    skip,
    take: query.pageSize,
  });

  return {
    items,
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / query.pageSize)),
    },
  };
}
