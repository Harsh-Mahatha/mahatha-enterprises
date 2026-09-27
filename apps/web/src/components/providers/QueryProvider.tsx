"use client";

import { useState, type ReactNode } from "react";
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "@/services/api/client";

const MAX_RETRIES = 2;

function createQueryClient() {
  const client: QueryClient = new QueryClient({
    // Any successful save can affect data shown elsewhere (an invoice changes
    // stock, the customer's balance, the dashboard and reports), so every
    // mutation marks all cached data stale. Only queries currently on screen
    // refetch right away; the rest refetch the next time they're shown. This
    // is what makes the long staleTime below safe. The signed-in user is
    // excluded — it only changes through login/logout, which set it directly.
    mutationCache: new MutationCache({
      onSuccess: () => {
        void client.invalidateQueries({ predicate: (query) => query.queryKey[0] !== "auth" });
      },
    }),
    defaultOptions: {
      queries: {
        // Data is served from cache without a request for this long. Changes
        // made in this app invalidate it immediately (above); this only bounds
        // how long a change made on another device takes to show up.
        staleTime: 2 * 60_000,
        gcTime: 10 * 60_000,
        refetchOnWindowFocus: false,
        // A 4xx (not found, validation, unauthenticated, rate-limited) won't
        // succeed on retry, so only retry network/server errors.
        retry: (failureCount, error) =>
          failureCount < MAX_RETRIES && !(error instanceof ApiError && error.status >= 400 && error.status < 500),
      },
    },
  });
  return client;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(createQueryClient);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
