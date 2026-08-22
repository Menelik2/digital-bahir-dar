import { useQuery } from '@tanstack/react-query'
import {
  fetchPlaces,
  fetchCategories,
  fetchPlaceBySlug,
  getCuratedPlaces,
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
  const curated = useMemo(() => getCuratedPlaces(categorySlug), [categorySlug])

  return useQuery({
    queryKey: qk.places.list(categorySlug),
    queryFn: async () => {
      try {
        const data = await fetchPlaces({ categorySlug })
        return data.length > 0 ? data : curated
      } catch (e) {
        if (e instanceof PlacesFetchError) throw e
        // Network failure → still show curated instantly
        return curated
      }
    },
    // Paint curated data on first frame — no spinner for empty network
    initialData: curated,
    initialDataUpdatedAt: 0,
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
    retry: isSupabaseConfigured ? 1 : 0,
    refetchOnWindowFocus: false,
  })
}

export function usePlace(slug: string | undefined) {
  return useQuery({
    queryKey: qk.places.detail(slug || ''),
    queryFn: () => fetchPlaceBySlug(slug!),
    enabled: !!slug,
    staleTime: 10 * 60_000,
    placeholderData: () => (slug ? getCuratedPlaces().find((p) => p.slug === slug) : undefined),
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
    isError,
    refetch,
    total: places.length,
  }
}
