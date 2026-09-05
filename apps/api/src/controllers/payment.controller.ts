import type { Request, Response } from "express";
import type { CreatePaymentInput, ListPaymentsQuery } from "@mahatha/validation";
import * as paymentService from "../services/payment.service";

type IdParams = { id: string };

export async function listPayments(_req: Request, res: Response) {
  const query = res.locals.query as ListPaymentsQuery;
  const result = await paymentService.listPayments(query);
  res.json({ success: true, data: result });
}

export async function getPayment(req: Request<IdParams>, res: Response) {
  const payment = await paymentService.getPayment(req.params.id);
  res.json({ success: true, data: payment });
}

export async function createPayment(req: Request, res: Response) {
  const input = req.body as CreatePaymentInput;
  const payment = await paymentService.createPayment(input);
  res.status(201).json({ success: true, data: payment });
}
