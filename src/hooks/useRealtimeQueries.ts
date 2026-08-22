import { useRealtimeSubscription } from './useRealtime'
import { useAuth } from './useAuth'
import { qk } from '@/lib/queryKeys'

/** Global places channel — mount once via RealtimeProvider */
export function usePlacesRealtime(enabled = true) {
  return useRealtimeSubscription({
    table: 'places',
    event: '*',
    enabled,
    invalidateKeys: [qk.places.all, qk.places.detail(''), qk.categories.all].map((k) =>
      // detail('') only used as prefix marker — real invalidation uses ['place']
      k[0] === 'place' ? (['place'] as const) : k
    ),
  })
}

export function useReviewsRealtime(placeId: string | undefined) {
  return useRealtimeSubscription({
    table: 'reviews',
    filter: placeId ? `place_id=eq.${placeId}` : undefined,
    event: '*',
    enabled: !!placeId,
    invalidateKeys: placeId
      ? [
          qk.reviews.list(placeId),
          qk.reviews.minePrefix(placeId),
          qk.reviews.summary(placeId),
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
    invalidateKeys: user
      ? [qk.favorites.list(user.id), qk.favorites.userPrefix(user.id)]
      : [],
  })
}

export function useTripsRealtime() {
  const { user } = useAuth()
  return useRealtimeSubscription({
    table: 'trips',
    filter: user ? `user_id=eq.${user.id}` : undefined,
    event: '*',
    enabled: !!user,
    invalidateKeys: user
      ? [qk.trips.list(user.id), qk.trips.detailPrefix]
      : [],
  })
}

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
          { table: 'trip_stops' },
        ]
      : [],
    invalidateKeys: tripId
      ? [qk.trips.detail(tripId), qk.trips.listPrefix]
      : [],
  })
}

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
      qk.admin.places,
      qk.admin.reviews,
      qk.admin.claims,
      qk.admin.businesses,
      qk.admin.reports,
      qk.admin.metrics,
      qk.places.all,
    ],
  })
}
