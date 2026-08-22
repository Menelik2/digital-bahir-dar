import { useQuery } from '@tanstack/react-query'
import {
  fetchPlaces,
  fetchCategories,
  fetchPlaceBySlug,
  placesOrDemo,
  searchPlaces,
  rankNearby,
  PlacesFetchError,
} from '@/services/places'
import type { Place } from '@/types/place'
import { useAppStore } from '@/store'
import { useMemo } from 'react'
import { qk } from '@/lib/queryKeys'
import { isSupabaseConfigured } from '@/lib/supabase'

export function usePlaces(categorySlug?: string) {
  return useQuery({
    queryKey: qk.places.list(categorySlug),
    queryFn: async () => {
      try {
        const data = await fetchPlaces({ categorySlug })
        // Empty successful response → DEMO for UX; errors are thrown
        return placesOrDemo(data, categorySlug)
      } catch (e) {
        // Re-throw so UI can show error (do not hide behind DEMO)
        if (e instanceof PlacesFetchError) throw e
        throw e
      }
    },
    staleTime: 5 * 60_000,
    retry: isSupabaseConfigured ? 1 : 0,
  })
}

export function usePlace(slug: string | undefined) {
  return useQuery({
    queryKey: qk.places.detail(slug || ''),
    queryFn: () => fetchPlaceBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: qk.categories.all,
    queryFn: fetchCategories,
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
  const { data: places = [], isLoading, error, refetch, isError } = usePlaces(
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

  return { places: filtered, isLoading, error, isError, refetch, total: places.length }
}
