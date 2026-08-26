import { useQuery } from '@tanstack/react-query'
import {
  fetchPlaces,
  fetchCategories,
  fetchPlaceBySlug,
  getCuratedPlaces,
  searchPlaces,
  rankNearby,
} from '@/services/places'
import { CURATED_HOTELS } from '@/services/curatedHotels'
import type { Place } from '@/types/place'
import { useAppStore } from '@/store'
import { useMemo } from 'react'
import { qk } from '@/lib/queryKeys'
import { isSupabaseConfigured } from '@/lib/supabase'

function mergeByName(primary: Place[], secondary: Place[]): Place[] {
  const seen = new Set(
    primary.map((p) => p.name.toLowerCase().replace(/\s+/g, ' ').trim().split(' · ')[0])
  )
  const out = [...primary]
  for (const p of secondary) {
    const base = p.name.toLowerCase().replace(/\s+/g, ' ').trim().split(' · ')[0]
    if (seen.has(base)) continue
    seen.add(base)
    out.push(p)
  }
  return out
}

/** Hotels list always includes the full curated list (user map links) */
function withCuratedHotels(data: Place[], categorySlug?: string): Place[] {
  if (categorySlug !== 'hotel') return data
  return mergeByName(CURATED_HOTELS, data)
}

export function usePlaces(categorySlug?: string) {
  const curated = useMemo(() => getCuratedPlaces(categorySlug), [categorySlug])

  return useQuery({
    queryKey: qk.places.list(categorySlug),
    queryFn: async () => {
      try {
        const data = await fetchPlaces({ categorySlug })
        const base = data.length > 0 ? data : curated
        return withCuratedHotels(base, categorySlug)
      } catch {
        return withCuratedHotels(curated, categorySlug)
      }
    },
    placeholderData: withCuratedHotels(curated, categorySlug),
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
    retry: isSupabaseConfigured ? 1 : 0,
    refetchOnWindowFocus: false,
  })
}

export function usePlace(slug: string | undefined) {
  return useQuery({
    queryKey: qk.places.detail(slug || ''),
    queryFn: async () => {
      try {
        return await fetchPlaceBySlug(slug!)
      } catch {
        return getCuratedPlaces().find((p) => p.slug === slug) ?? null
      }
    },
    enabled: !!slug,
    staleTime: 10 * 60_000,
    placeholderData: () => (slug ? getCuratedPlaces().find((p) => p.slug === slug) : undefined),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: qk.categories.all,
    queryFn: async () => {
      try {
        return await fetchCategories()
      } catch {
        return []
      }
    },
    staleTime: 30 * 60_000,
  })
}

export function useFilteredPlaces(opts: {
  search?: string
  categorySlug?: string | null
  nearMe?: boolean
  verifiedOnly?: boolean
  radiusM?: number
}) {
  const { data: places = [], isLoading, error, refetch, isError, isFetching } = usePlaces(
    opts.categorySlug ?? undefined
  )
  const { location } = useAppStore()
  const radius = opts.radiusM ?? 12_000

  const filtered = useMemo(() => {
    let list: Place[] = places
    if (opts.verifiedOnly) list = list.filter((p) => p.verified)
    if (opts.search) list = searchPlaces(list, opts.search)
    if (opts.nearMe && location.latitude != null && location.longitude != null) {
      return rankNearby(list, location.latitude, location.longitude, radius)
    }
    return list
  }, [
    places,
    opts.search,
    opts.nearMe,
    opts.verifiedOnly,
    location.latitude,
    location.longitude,
    radius,
  ])

  return {
    places: filtered,
    isLoading: isLoading && places.length === 0,
    isFetching,
    error,
    isError: isError && places.length === 0,
    refetch,
    total: places.length,
  }
}
