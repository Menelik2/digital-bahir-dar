/**
 * Central React Query key factory.
 * Use these everywhere (hooks, mutations, realtimeHub) so invalidation stays in sync.
 *
 * TanStack Query matches by prefix: invalidating ['places'] refreshes ['places', 'hotel'], etc.
 */
export const qk = {
  places: {
    all: ['places'] as const,
    list: (categorySlug?: string | null) =>
      ['places', categorySlug ?? 'all'] as const,
    detail: (slug: string) => ['place', slug] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  reviews: {
    list: (placeId: string) => ['reviews', placeId] as const,
    mine: (placeId: string, userId?: string) =>
      ['my-review', placeId, userId] as const,
    /** Prefix used by realtime (covers all users' my-review for place) */
    minePrefix: (placeId: string) => ['my-review', placeId] as const,
    summary: (placeId: string) => ['rating-summary', placeId] as const,
  },
  favorites: {
    list: (userId: string) => ['favorites', userId] as const,
    one: (userId: string, placeId: string) =>
      ['favorite', userId, placeId] as const,
    /** Prefix: all favorite flags for user */
    userPrefix: (userId: string) => ['favorite', userId] as const,
  },
  trips: {
    list: (userId: string) => ['trips', userId] as const,
    listPrefix: ['trips'] as const,
    detail: (tripId: string) => ['trip', tripId] as const,
    detailPrefix: ['trip'] as const,
  },
  admin: {
    role: (userId: string) => ['my-role', userId] as const,
    metrics: ['admin-metrics'] as const,
    places: ['admin-places'] as const,
    reviews: ['admin-reviews'] as const,
    claims: ['admin-claims'] as const,
    businesses: ['admin-businesses'] as const,
    reports: ['admin-reports'] as const,
  },
  business: {
    profile: (userId: string) => ['business-profile', userId] as const,
    claims: (userId: string) => ['place-claims', userId] as const,
  },
} as const

/** Keys to drop on sign-out so the next account never sees the previous user's cache */
export const USER_SCOPED_KEY_ROOTS = [
  'favorites',
  'favorite',
  'trips',
  'trip',
  'my-review',
  'my-role',
  'business-profile',
  'place-claims',
  'admin-metrics',
  'admin-places',
  'admin-reviews',
  'admin-claims',
  'admin-businesses',
  'admin-reports',
] as const
