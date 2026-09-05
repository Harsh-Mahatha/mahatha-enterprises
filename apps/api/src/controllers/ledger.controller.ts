import type { Request, Response } from "express";
import type { PaginationQuery } from "@mahatha/validation";
import * as ledgerService from "../services/ledger.service";

type IdParams = { id: string };

export async function getCustomerLedger(req: Request<IdParams>, res: Response) {
  const query = res.locals.query as PaginationQuery;
  const result = await ledgerService.getCustomerLedger(req.params.id, query);
  res.json({ success: true, data: result });
}
