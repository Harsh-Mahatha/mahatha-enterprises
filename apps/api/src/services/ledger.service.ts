import type { PaginationQuery } from "@mahatha/validation";
import { AppError } from "../middleware/error-handler";
import * as customerRepository from "../repositories/customer.repository";
import * as ledgerRepository from "../repositories/ledger.repository";

export async function getCustomerLedger(customerId: string, query: PaginationQuery) {
  const customer = await customerRepository.findCustomerById(customerId);
  if (!customer) {
    throw new AppError("Customer not found.", 404, "NOT_FOUND");
  }

  const skip = (query.page - 1) * query.pageSize;
  const [items, totalItems] = await ledgerRepository.findLedgerEntries({
    customerId,
    skip,
    take: query.pageSize,
  });
  const lastEntry = await ledgerRepository.findLatestLedgerEntry(customerId);

  return {
    customer,
    outstanding: lastEntry ? Number(lastEntry.balanceAfter) : 0,
    items,
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / query.pageSize)),
    },
  };
}
