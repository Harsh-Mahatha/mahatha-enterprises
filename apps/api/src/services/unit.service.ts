import type { CreateUnitInput } from "@mahatha/validation";
import { AppError } from "../middleware/error-handler";
import * as unitRepository from "../repositories/unit.repository";

export function listUnits() {
  return unitRepository.findUnits();
}

export async function createUnit(input: CreateUnitInput) {
  const existing = await unitRepository.findUnitByName(input.name);
  if (existing) {
    throw new AppError(`The unit "${existing.name}" already exists.`, 409, "DUPLICATE_VALUE");
  }
  return unitRepository.createUnit(input.name);
}

// Resolves a submitted unit name to the canonical stored spelling, rejecting
// names that aren't in the unit list.
export async function resolveUnitName(name: string) {
  const unit = await unitRepository.findUnitByName(name);
  if (!unit) {
    throw new AppError(`Unknown unit "${name}". Add it to the unit list first.`, 400, "VALIDATION_ERROR");
  }
  return unit.name;
}
