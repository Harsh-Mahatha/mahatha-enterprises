import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = PrismaClient | Prisma.TransactionClient;

export function findCustomers(params: { search?: string; skip: number; take: number }, client: Client = prisma) {
  const where: Prisma.CustomerWhereInput = params.search
    ? {
        OR: [
          { name: { contains: params.search, mode: "insensitive" } },
          { phone: { contains: params.search, mode: "insensitive" } },
        ],
      }
    : {};

  return Promise.all([
    client.customer.findMany({
      where,
      orderBy: { name: "asc" },
      skip: params.skip,
      take: params.take,
    }),
    client.customer.count({ where }),
  ]);
}

export function findCustomerById(id: string, client: Client = prisma) {
  return client.customer.findUnique({ where: { id } });
}

export function createCustomer(
  data: {
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    openingBalance: number;
  },
  client: Client = prisma,
) {
  return client.customer.create({ data });
}

export function updateCustomer(
  id: string,
  data: { name: string; phone: string | null; email: string | null; address: string | null },
  client: Client = prisma,
) {
  return client.customer.update({ where: { id }, data });
}

export function setCustomerActive(id: string, active: boolean, client: Client = prisma) {
  return client.customer.update({ where: { id }, data: { active } });
}
