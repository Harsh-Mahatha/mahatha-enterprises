import type { Request, Response } from "express";
import type {
  CreateCustomerInput,
  ListCustomersQuery,
  SetCustomerActiveInput,
  UpdateCustomerInput,
} from "@mahatha/validation";
import * as customerService from "../services/customer.service";

type IdParams = { id: string };

export async function listCustomers(_req: Request, res: Response) {
  const query = res.locals.query as ListCustomersQuery;
  const result = await customerService.listCustomers(query);
  res.json({ success: true, data: result });
}

export async function getCustomer(req: Request<IdParams>, res: Response) {
  const customer = await customerService.getCustomer(req.params.id);
  res.json({ success: true, data: customer });
}

export async function createCustomer(req: Request, res: Response) {
  const input = req.body as CreateCustomerInput;
  const customer = await customerService.createCustomer(input);
  res.status(201).json({ success: true, data: customer });
}

export async function updateCustomer(req: Request<IdParams>, res: Response) {
  const input = req.body as UpdateCustomerInput;
  const customer = await customerService.updateCustomer(req.params.id, input);
  res.json({ success: true, data: customer });
}

export async function setCustomerActive(req: Request<IdParams>, res: Response) {
  const { active } = req.body as SetCustomerActiveInput;
  const customer = await customerService.setCustomerActive(req.params.id, active);
  res.json({ success: true, data: customer });
}
