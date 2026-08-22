import { useRealtimeSubscription } from './useRealtime'
import { useAuth } from './useAuth'

/**
 * Global places channel — mount once (e.g. Layout), not inside every usePlaces().
 */
export function usePlacesRealtime(enabled = true) {
  return useRealtimeSubscription({
    table: 'places',
    event: '*',
    enabled,
    invalidateKeys: [['places'], ['place'], ['categories']],
  })
}

/** Reviews for one place — shared channel per place_id */
export function useReviewsRealtime(placeId: string | undefined) {
  return useRealtimeSubscription({
    table: 'reviews',
    filter: placeId ? `place_id=eq.${placeId}` : undefined,
    event: '*',
    enabled: !!placeId,
    invalidateKeys: placeId
      ? [
          ['reviews', placeId],
          ['my-review', placeId],
          ['rating-summary', placeId],
        ]
      : [],
  })
}

export function useFavoritesRealtime() {
  const { user } = useAuth()
  return useRealtimeSubscription({
    table: 'favorites',
    filter: user ? `user_id=eq.${user.id}` : undefined,
    event: '*',
    enabled: !!user,
    invalidateKeys: user ? [['favorites', user.id], ['favorite', user.id]] : [],
  })
}

export function useTripsRealtime() {
  const { user } = useAuth()
  return useRealtimeSubscription({
    table: 'trips',
    filter: user ? `user_id=eq.${user.id}` : undefined,
    event: '*',
    enabled: !!user,
    invalidateKeys: user ? [['trips', user.id], ['trip']] : [],
  })
}

/**
 * One channel, four table bindings — avoids 4 separate websockets per trip page.
 */
export function useTripDetailRealtime(tripId: string | undefined) {
  const active = !!tripId && !tripId.startsWith('demo-')

  return useRealtimeSubscription({
    table: 'trips',
    filter: tripId ? `id=eq.${tripId}` : undefined,
    enabled: active,
    extraTopics: tripId
      ? [
          { table: 'trip_days', filter: `trip_id=eq.${tripId}` },
          { table: 'trip_expenses', filter: `trip_id=eq.${tripId}` },
          // stops lack trip_id; scoped only while a real trip is open
          { table: 'trip_stops' },
        ]
      : [],
    invalidateKeys: tripId ? [['trip', tripId], ['trips']] : [],
  })
}

/**
 * Admin: one shared channel for all moderation tables (not 5 channels).
 */
export function useAdminRealtime(enabled: boolean) {
  return useRealtimeSubscription({
    table: 'places',
    enabled,
    extraTopics: [
      { table: 'reviews' },
      { table: 'place_claims' },
      { table: 'business_profiles' },
      { table: 'review_reports' },
    ],
    invalidateKeys: [
      ['admin-places'],
      ['admin-reviews'],
      ['admin-claims'],
      ['admin-businesses'],
      ['admin-reports'],
      ['admin-metrics'],
      ['places'],
    ],
  })
}
