import { isServer, QueryClient } from "@tanstack/react-query";

let currentBrowserClient: QueryClient | undefined = undefined;

export function browserQueryClient() {
  if (isServer) return makeBrowserClient();

  if (!currentBrowserClient) {
    currentBrowserClient = makeBrowserClient();
  }

  return currentBrowserClient;
}

function makeBrowserClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 2,
        refetchOnWindowFocus: true,
      },
    },
  });
}
