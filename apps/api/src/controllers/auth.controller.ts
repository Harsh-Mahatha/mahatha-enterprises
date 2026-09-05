import type { Request, Response } from "express";
import type { ApiResponse, AuthUser } from "@mahatha/types";
import type { ChangePasswordInput, LoginInput } from "@mahatha/validation";
import { SESSION_COOKIE_NAME } from "@mahatha/config";
import { env } from "../config/env";
import * as authService from "../services/auth.service";

function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax" as const,
    expires: expiresAt,
    path: "/",
  };
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginInput;
  const { user, token, expiresAt } = await authService.login(email, password);

  res.cookie(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));

  const response: ApiResponse<{ user: AuthUser }> = { success: true, data: { user } };
  res.json(response);
}

export async function logout(req: Request, res: Response) {
  if (req.sessionToken) {
    await authService.logout(req.sessionToken);
  }
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });

  const response: ApiResponse<null> = { success: true, data: null };
  res.json(response);
}

export function me(req: Request, res: Response) {
  const response: ApiResponse<{ user: AuthUser }> = { success: true, data: { user: req.user! } };
  res.json(response);
}

export async function changePassword(req: Request, res: Response) {
  const { currentPassword, newPassword } = req.body as ChangePasswordInput;
  await authService.changePassword(req.user!.id, currentPassword, newPassword, req.sessionToken!);

  const response: ApiResponse<null> = { success: true, data: null };
  res.json(response);
}
