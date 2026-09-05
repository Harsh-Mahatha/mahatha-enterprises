import type { NextFunction, Request, Response } from "express";
import type { ApiErrorResponse } from "@mahatha/types";

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function notFoundHandler(_req: Request, res: Response) {
  const response: ApiErrorResponse = {
    success: false,
    message: "Route not found.",
    code: "NOT_FOUND",
  };
  res.status(404).json(response);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : "INTERNAL_ERROR";
  const message = isAppError ? err.message : "Something went wrong.";

  if (!isAppError) {
    console.error(err);
  }

  const response: ApiErrorResponse = { success: false, message, code };
  res.status(statusCode).json(response);
}
