import { Router } from "express";
import type { ApiResponse } from "@mahatha/types";
import { prisma } from "../config/prisma";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  const database = await prisma
    .$queryRaw`SELECT 1`
    .then(() => "connected" as const)
    .catch(() => "unavailable" as const);

  const response: ApiResponse<{ status: "ok"; database: "connected" | "unavailable" }> = {
    success: true,
    data: { status: "ok", database },
  };
  res.json(response);
});
