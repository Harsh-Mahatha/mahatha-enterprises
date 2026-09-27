import type { Unit } from "@mahatha/types";
import { apiRequest } from "./client";

export function listUnits() {
  return apiRequest<Unit[]>("/api/units");
}

export function createUnit(name: string) {
  return apiRequest<Unit>("/api/units", { method: "POST", body: { name } });
}
