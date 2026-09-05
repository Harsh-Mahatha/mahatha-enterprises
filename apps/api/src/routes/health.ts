import { Router } from "express";
import type { ApiResponse } from "@mahatha/types";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  const response: ApiResponse<{ status: "ok" }> = {
    success: true,
    data: { status: "ok" },
  };
  res.json(response);
});
