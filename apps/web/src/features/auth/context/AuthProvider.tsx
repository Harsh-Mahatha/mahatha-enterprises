"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthUser } from "@mahatha/types";
import * as authService from "@/services/api/auth";

const ME_QUERY_KEY = ["auth", "me"] as const;

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const { user } = await authService.getMe();
    return user;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // fetchCurrentUser never throws (a signed-out visitor is a valid "no user"
  // result, not a query error), so this never enters an error/retry state.
  const { data: user = null, isLoading } = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: fetchCurrentUser,
  });

  const login = useCallback(
    async (email: string, password: string) => {
      const { user: loggedInUser } = await authService.login(email, password);
      queryClient.setQueryData(ME_QUERY_KEY, loggedInUser);
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    queryClient.setQueryData(ME_QUERY_KEY, null);
  }, [queryClient]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
