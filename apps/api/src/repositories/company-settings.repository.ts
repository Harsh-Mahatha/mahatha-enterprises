import { prisma } from "../config/prisma";

export function findCompanySettings() {
  return prisma.companySettings.findFirst();
}

export function createDefaultCompanySettings() {
  return prisma.companySettings.create({
    data: { businessName: "My Company", invoicePrefix: "INV-" },
  });
}

export function updateCompanySettings(
  id: string,
  data: {
    businessName: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
    invoicePrefix: string;
  },
) {
  return prisma.companySettings.update({ where: { id }, data });
}
