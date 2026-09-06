import type { AuthUser } from "@mahatha/types";
import { apiRequest } from "./client";

export function login(email: string, password: string) {
  return apiRequest<{ user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function logout() {
  return apiRequest<null>("/api/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiRequest<{ user: AuthUser }>("/api/auth/me", { skipAuthRedirect: true });
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiRequest<null>("/api/auth/change-password", {
    method: "POST",
    body: { currentPassword, newPassword },
  });
}
