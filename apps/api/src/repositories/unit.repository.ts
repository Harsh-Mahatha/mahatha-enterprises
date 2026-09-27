import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = PrismaClient | Prisma.TransactionClient;

export function findUnits(client: Client = prisma) {
  return client.unit.findMany({ orderBy: { name: "asc" } });
}

// Case-insensitive, so "kg" and "Kg" are treated as the same unit.
export function findUnitByName(name: string, client: Client = prisma) {
  return client.unit.findFirst({ where: { name: { equals: name, mode: "insensitive" } } });
}

export function createUnit(name: string, client: Client = prisma) {
  return client.unit.create({ data: { name } });
}
