import { QueryClient } from '@tanstack/react-query'
import { USER_SCOPED_KEY_ROOTS } from './queryKeys'
import { realtimeHub } from './realtimeHub'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

// Hub always points at the same client (avoids per-hook setQueryClient races)
realtimeHub.setQueryClient(queryClient)

/** Remove user-specific cache after logout or account switch */
export function clearUserQueryCache() {
  for (const root of USER_SCOPED_KEY_ROOTS) {
    void queryClient.removeQueries({ queryKey: [root] })
  }
}
