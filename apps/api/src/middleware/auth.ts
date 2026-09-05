import type { NextFunction, Request, Response } from "express";
import type { AuthUser } from "@mahatha/types";
import { SESSION_COOKIE_NAME } from "@mahatha/config";
import { getSessionUser } from "../services/auth.service";
import { AppError } from "./error-handler";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
      sessionToken?: string;
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token: string | undefined = req.cookies?.[SESSION_COOKIE_NAME];
  const user = token ? await getSessionUser(token) : null;

  if (!token || !user) {
    next(new AppError("Authentication required.", 401, "UNAUTHENTICATED"));
    return;
  }

  req.user = user;
  req.sessionToken = token;
  next();
}
