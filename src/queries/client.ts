import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 6, // data considered stale after 6 hours
      cacheTime: 1000 * 60 * 60 * 6, // data will be in cache for 6 hours
      // but usage of cache will depend on stale time
    },
  },
});
