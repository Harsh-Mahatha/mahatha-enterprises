import type { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import type { ApiErrorResponse } from "@mahatha/types";

function tooManyRequests(message: string) {
  return (_req: Request, res: Response) => {
    const response: ApiErrorResponse = { success: false, message, code: "RATE_LIMITED" };
    res.status(429).json(response);
  };
}

// Per-IP ceiling for the whole API. Normal use (a page load is a handful of
// requests) stays far below it; it only stops runaway loops or scripted abuse.
export const apiRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: tooManyRequests("Too many requests. Please wait a moment and try again."),
});

// Much stricter limit on login attempts to slow down password guessing.
// Successful logins don't count against it.
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60_000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: tooManyRequests("Too many login attempts. Please try again in 15 minutes."),
});
