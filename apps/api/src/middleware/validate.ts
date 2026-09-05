import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "./error-handler";

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new AppError(result.error.issues[0]?.message ?? "Invalid request.", 400, "VALIDATION_ERROR"));
      return;
    }
    req.body = result.data;
    next();
  };
}

// Query params arrive as strings and Express types req.query as ParsedQs, so
// the coerced/typed result is stashed on res.locals.query rather than
// reassigned onto req.query.
export function validateQuery<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      next(new AppError(result.error.issues[0]?.message ?? "Invalid query parameters.", 400, "VALIDATION_ERROR"));
      return;
    }
    res.locals.query = result.data;
    next();
  };
}

// Route params (e.g. :id) are UUID-typed columns in Postgres; a malformed
// value would otherwise reach Prisma and surface as a raw P2007 error. This
// rejects it cleanly at the boundary instead.
export function validateParams<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      next(new AppError(result.error.issues[0]?.message ?? "Invalid request.", 400, "VALIDATION_ERROR"));
      return;
    }
    next();
  };
}
