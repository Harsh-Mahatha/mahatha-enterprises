import type { Request, Response } from "express";
import type { CreateInvoiceInput, ListInvoicesQuery } from "@mahatha/validation";
import * as invoiceService from "../services/invoice.service";

type IdParams = { id: string };

export async function listInvoices(_req: Request, res: Response) {
  const query = res.locals.query as ListInvoicesQuery;
  const result = await invoiceService.listInvoices(query);
  res.json({ success: true, data: result });
}

export async function getInvoice(req: Request<IdParams>, res: Response) {
  const invoice = await invoiceService.getInvoice(req.params.id);
  res.json({ success: true, data: invoice });
}

export async function createInvoice(req: Request, res: Response) {
  const input = req.body as CreateInvoiceInput;
  const invoice = await invoiceService.createInvoice(input);
  res.status(201).json({ success: true, data: invoice });
}
