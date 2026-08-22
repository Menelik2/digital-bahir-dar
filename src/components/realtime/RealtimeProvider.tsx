import type { ReactNode } from 'react'
import { usePlacesRealtime, useFavoritesRealtime, useTripsRealtime } from '@/hooks/useRealtimeQueries'

/**
 * Mount once under QueryClientProvider.
 * - Always: places publication (shared by all list pages)
 * - When signed in: favorites + trips list (one channel each, ref-counted)
 */
export function RealtimeProvider({ children }: { children: ReactNode }) {
  usePlacesRealtime(true)
  useFavoritesRealtime()
  useTripsRealtime()

  return <>{children}</>
}
