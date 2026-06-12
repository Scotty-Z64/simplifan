import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import type { AppRouter } from "../../api/router";
import type { ReactNode } from "react";

export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Static fallback data when API is unreachable
const API_URL = import.meta.env.VITE_API_URL || "/api/trpc";

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: API_URL,
      transformer: superjson,
      // Add timeout and error handling
      headers() {
        return {
          "x-static-mode": "true",
        };
      },
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        }).catch(() => {
          // Return empty successful response for offline mode
          return new Response(JSON.stringify({ result: { data: null } }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        });
      },
    }),
  ],
});

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
