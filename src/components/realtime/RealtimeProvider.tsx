import { usePlacesRealtime } from '@/hooks/useRealtimeQueries'
import { useFavoritesRealtime, useTripsRealtime } from '@/hooks/useRealtimeQueries'
import { useAuth } from '@/hooks/useAuth'

/**
 * Mount once under QueryClientProvider.
 * - Always: places publication (shared by all list pages)
 * - When signed in: favorites + trips list (one channel each, ref-counted)
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // Single global places subscription for the whole app
  usePlacesRealtime(true)

  // User-scoped channels only while authenticated
  useFavoritesRealtime()
  useTripsRealtime()

  // Silence unused when logged out — hooks no-op via enabled flags inside
  void user

  return <>{children}</>
}
