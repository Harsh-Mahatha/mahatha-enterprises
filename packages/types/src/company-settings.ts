export type CompanySettings = {
  id: string;
  businessName: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logoUrl: string | null;
  invoicePrefix: string;
  createdAt: string;
  updatedAt: string;
};
