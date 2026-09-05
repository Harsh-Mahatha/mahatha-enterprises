import type { CreateCustomerInput, ListCustomersQuery, UpdateCustomerInput } from "@mahatha/validation";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/error-handler";
import * as customerRepository from "../repositories/customer.repository";
import * as ledgerRepository from "../repositories/ledger.repository";

export async function listCustomers(query: ListCustomersQuery) {
  const skip = (query.page - 1) * query.pageSize;
  const [items, totalItems] = await customerRepository.findCustomers({
    search: query.search,
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

export async function getCustomer(id: string) {
  const customer = await customerRepository.findCustomerById(id);
  if (!customer) {
    throw new AppError("Customer not found.", 404, "NOT_FOUND");
  }
  return customer;
}

export async function createCustomer(input: CreateCustomerInput) {
  return prisma.$transaction(async (tx) => {
    const customer = await customerRepository.createCustomer(
      {
        name: input.name,
        phone: input.phone ?? null,
        email: input.email ?? null,
        address: input.address ?? null,
        openingBalance: input.openingBalance,
      },
      tx,
    );

    if (input.openingBalance !== 0) {
      await ledgerRepository.createLedgerEntry(
        {
          customerId: customer.id,
          type: "OPENING_BALANCE",
          amount: input.openingBalance,
          balanceAfter: input.openingBalance,
          date: customer.createdAt,
        },
        tx,
      );
    }

    return customer;
  });
}

export async function updateCustomer(id: string, input: UpdateCustomerInput) {
  await getCustomer(id);
  return customerRepository.updateCustomer(id, {
    name: input.name,
    phone: input.phone ?? null,
    email: input.email ?? null,
    address: input.address ?? null,
  });
}

export async function setCustomerActive(id: string, active: boolean) {
  await getCustomer(id);
  return customerRepository.setCustomerActive(id, active);
}
