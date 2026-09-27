import type { Request, Response } from "express";
import type { CreateUnitInput } from "@mahatha/validation";
import * as unitService from "../services/unit.service";

export async function listUnits(_req: Request, res: Response) {
  const units = await unitService.listUnits();
  res.json({ success: true, data: units });
}

export async function createUnit(req: Request, res: Response) {
  const input = req.body as CreateUnitInput;
  const unit = await unitService.createUnit(input);
  res.status(201).json({ success: true, data: unit });
}
