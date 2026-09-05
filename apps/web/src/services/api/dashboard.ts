import type { DashboardSummary } from "@mahatha/types";
import { apiRequest } from "./client";

export function getDashboardSummary() {
  return apiRequest<DashboardSummary>("/api/dashboard");
}
