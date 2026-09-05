import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
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

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : undefined;
}

// With @prisma/adapter-pg, P2002's `meta` nests the Postgres constraint name
// under driverAdapterError.cause.constraint.index (e.g. "Product_sku_key")
// instead of the classic `meta.target` field-name array.
function extractConstraintIndexName(meta: Record<string, unknown> | undefined): string | undefined {
  const index = asRecord(asRecord(asRecord(meta?.driverAdapterError)?.cause)?.constraint)?.index;
  return typeof index === "string" ? index : undefined;
}

function describeUniqueConstraintTarget(err: Prisma.PrismaClientKnownRequestError): string {
  const target = err.meta?.target;
  if (Array.isArray(target)) {
    return target.join(", ");
  }

  const indexName = extractConstraintIndexName(err.meta);
  if (!indexName) {
    return "field";
  }

  const table = typeof err.meta?.modelName === "string" ? err.meta.modelName : undefined;
  const field = table && indexName.startsWith(`${table}_`) ? indexName.slice(table.length + 1) : indexName;
  return field.replace(/_key$/, "") || "field";
}

function fromPrismaError(err: Prisma.PrismaClientKnownRequestError): AppError | null {
  if (err.code === "P2002") {
    return new AppError(`This ${describeUniqueConstraintTarget(err)} is already in use.`, 409, "DUPLICATE_VALUE");
  }
  if (err.code === "P2025") {
    return new AppError("Record not found.", 404, "NOT_FOUND");
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const appError =
    err instanceof AppError
      ? err
      : err instanceof Prisma.PrismaClientKnownRequestError
        ? fromPrismaError(err)
        : null;

  if (!appError) {
    console.error(err);
  }

  const statusCode = appError?.statusCode ?? 500;
  const code = appError?.code ?? "INTERNAL_ERROR";
  const message = appError?.message ?? "Something went wrong.";

  const response: ApiErrorResponse = { success: false, message, code };
  res.status(statusCode).json(response);
}
