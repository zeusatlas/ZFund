import { QueryClient, isServer } from "@tanstack/react-query";
import type { ApiError } from "./api/client";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: (count, error) => {
          const status = (error as Partial<ApiError>).status ?? 0;
          // Don't retry client errors (4xx); retry network/5xx up to twice.
          return !(status >= 400 && status < 500) && count < 2;
        },
      },
    },
  });
}

let browserClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) return makeQueryClient();
  return (browserClient ??= makeQueryClient());
}
