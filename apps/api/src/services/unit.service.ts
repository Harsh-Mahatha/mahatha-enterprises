import type { CreateUnitInput } from "@mahatha/validation";
import { AppError } from "../middleware/error-handler";
import * as unitRepository from "../repositories/unit.repository";
import { TtlCache } from "../utils/ttl-cache";

type Unit = Awaited<ReturnType<typeof unitRepository.createUnit>>;

// The unit list is tiny and read on every product form load and product save,
// so it's cached and dropped whenever a unit is added.
const UNITS_CACHE_TTL_MS = 5 * 60_000;
const unitsCache = new TtlCache<"units", Unit[]>(UNITS_CACHE_TTL_MS);

export async function listUnits() {
  const cached = unitsCache.get("units");
  if (cached) {
    return cached;
  }
  const units = await unitRepository.findUnits();
  unitsCache.set("units", units);
  return units;
}

// Case-insensitive, so "kg" and "Kg" are treated as the same unit. Falls back
// to the database on a miss in case the unit was added by another instance.
async function findUnitByName(name: string) {
  const lowered = name.toLowerCase();
  const units = await listUnits();
  return units.find((unit) => unit.name.toLowerCase() === lowered) ?? unitRepository.findUnitByName(name);
}

export async function createUnit(input: CreateUnitInput) {
  const existing = await findUnitByName(input.name);
  if (existing) {
    throw new AppError(`The unit "${existing.name}" already exists.`, 409, "DUPLICATE_VALUE");
  }
  const unit = await unitRepository.createUnit(input.name);
  unitsCache.clear();
  return unit;
}

// Resolves a submitted unit name to the canonical stored spelling, rejecting
// names that aren't in the unit list.
export async function resolveUnitName(name: string) {
  const unit = await findUnitByName(name);
  if (!unit) {
    throw new AppError(`Unknown unit "${name}". Add it to the unit list first.`, 400, "VALIDATION_ERROR");
  }
  return unit.name;
}
