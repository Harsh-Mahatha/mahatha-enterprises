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
