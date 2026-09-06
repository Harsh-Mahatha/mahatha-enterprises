import type { ApiResponse } from "@mahatha/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Set by the auth "who am I" check — that call is expected to 401 for a
   * signed-out visitor, so it must not trigger the redirect below. */
  skipAuthRedirect?: boolean;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!payload || !payload.success) {
    const code = payload && !payload.success ? payload.code : "UNKNOWN_ERROR";
    const message = payload && !payload.success ? payload.message : "Something went wrong.";

    // A session that's expired or been invalidated server-side (e.g. after a
    // password change elsewhere) leaves a stale cookie that looks present to
    // proxy.ts's optimistic check but fails every real request. Bounce to
    // /login instead of letting every widget on the page fail silently.
    if (code === "UNAUTHENTICATED" && !options.skipAuthRedirect && typeof window !== "undefined") {
      // The cookie is httpOnly, so it can't be cleared from here directly —
      // without this, the stale cookie survives the navigation and
      // proxy.ts's presence-only check bounces /login straight back into the
      // app, which 401s again, looping forever. Clear it server-side first,
      // then hard-navigate (not router.push: this is a plain utility
      // function with no access to the router, and a full reload guarantees
      // no stale client-side state/query cache survives into the login page).
      fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" })
        .catch(() => {})
        .finally(() => {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/login";
        });
    }

    throw new ApiError(message, code, response.status);
  }

  return payload.data;
}

export function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
