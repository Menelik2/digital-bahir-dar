import { useRealtimeSubscription } from './useRealtime'
import { useAuth } from './useAuth'

/** Live updates for published places / category lists */
export function usePlacesRealtime(enabled = true) {
  return useRealtimeSubscription({
    table: 'places',
    event: '*',
    enabled,
    channelName: 'places-all',
    invalidateKeys: [['places'], ['place'], ['categories']],
  })
}

/** Live reviews + rating for a place detail page */
export function useReviewsRealtime(placeId: string | undefined) {
  return useRealtimeSubscription({
    table: 'reviews',
    filter: placeId ? `place_id=eq.${placeId}` : undefined,
    event: '*',
    enabled: !!placeId,
    channelName: placeId ? `reviews-${placeId}` : 'reviews-off',
    invalidateKeys: placeId
      ? [
          ['reviews', placeId],
          ['my-review', placeId],
          ['rating-summary', placeId],
        ]
      : [],
  })
}

/** Live favorites for the signed-in user */
export function useFavoritesRealtime() {
  const { user } = useAuth()
  return useRealtimeSubscription({
    table: 'favorites',
    filter: user ? `user_id=eq.${user.id}` : undefined,
    event: '*',
    enabled: !!user,
    channelName: user ? `favorites-${user.id}` : 'favorites-off',
    invalidateKeys: user ? [['favorites', user.id], ['favorite', user.id]] : [],
  })
}

/** Live trip list for the signed-in user */
export function useTripsRealtime() {
  const { user } = useAuth()
  return useRealtimeSubscription({
    table: 'trips',
    filter: user ? `user_id=eq.${user.id}` : undefined,
    event: '*',
    enabled: !!user,
    channelName: user ? `trips-${user.id}` : 'trips-off',
    invalidateKeys: user ? [['trips', user.id], ['trip']] : [],
  })
}

/** Live single trip + nested day/stop/expense changes (invalidate trip detail) */
export function useTripDetailRealtime(tripId: string | undefined) {
  const trips = useRealtimeSubscription({
    table: 'trips',
    filter: tripId ? `id=eq.${tripId}` : undefined,
    enabled: !!tripId && !tripId.startsWith('demo-'),
    channelName: tripId ? `trip-row-${tripId}` : 'trip-row-off',
    invalidateKeys: tripId ? [['trip', tripId], ['trips']] : [],
  })

  const days = useRealtimeSubscription({
    table: 'trip_days',
    filter: tripId ? `trip_id=eq.${tripId}` : undefined,
    enabled: !!tripId && !tripId.startsWith('demo-'),
    channelName: tripId ? `trip-days-${tripId}` : 'trip-days-off',
    invalidateKeys: tripId ? [['trip', tripId]] : [],
  })

  const expenses = useRealtimeSubscription({
    table: 'trip_expenses',
    filter: tripId ? `trip_id=eq.${tripId}` : undefined,
    enabled: !!tripId && !tripId.startsWith('demo-'),
    channelName: tripId ? `trip-exp-${tripId}` : 'trip-exp-off',
    invalidateKeys: tripId ? [['trip', tripId]] : [],
  })

  // trip_stops has no trip_id — refresh on any stop change while viewing a trip
  const stops = useRealtimeSubscription({
    table: 'trip_stops',
    event: '*',
    enabled: !!tripId && !tripId.startsWith('demo-'),
    channelName: tripId ? `trip-stops-${tripId}` : 'trip-stops-off',
    invalidateKeys: tripId ? [['trip', tripId]] : [],
  })

  return {
    isLive: trips.isLive || days.isLive || expenses.isLive || stops.isLive,
    status: trips.status,
  }
}

/** Admin moderation queues */
export function useAdminRealtime(enabled: boolean) {
  const places = useRealtimeSubscription({
    table: 'places',
    enabled,
    channelName: 'admin-places',
    invalidateKeys: [['admin-places'], ['admin-metrics'], ['places']],
  })
  const reviews = useRealtimeSubscription({
    table: 'reviews',
    enabled,
    channelName: 'admin-reviews',
    invalidateKeys: [['admin-reviews'], ['admin-metrics']],
  })
  const claims = useRealtimeSubscription({
    table: 'place_claims',
    enabled,
    channelName: 'admin-claims',
    invalidateKeys: [['admin-claims'], ['admin-metrics']],
  })
  const businesses = useRealtimeSubscription({
    table: 'business_profiles',
    enabled,
    channelName: 'admin-biz',
    invalidateKeys: [['admin-businesses'], ['admin-metrics']],
  })
  const reports = useRealtimeSubscription({
    table: 'review_reports',
    enabled,
    channelName: 'admin-reports',
    invalidateKeys: [['admin-reports'], ['admin-metrics']],
  })

  return {
    isLive: places.isLive || reviews.isLive || claims.isLive || businesses.isLive || reports.isLive,
    hasError:
      places.status === 'error' ||
      reviews.status === 'error' ||
      claims.status === 'error' ||
      businesses.status === 'error' ||
      reports.status === 'error',
  }
}
