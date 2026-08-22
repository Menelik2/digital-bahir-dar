import { useQuery } from '@tanstack/react-query'
import {
  fetchPlaces,
  fetchCategories,
  fetchPlaceBySlug,
  placesOrDemo,
  searchPlaces,
  rankNearby,
} from '@/services/places'
import type { Place } from '@/types/place'
import { useAppStore } from '@/store'
import { useMemo } from 'react'

/** Places list — realtime is mounted once in Layout (usePlacesRealtime), not here. */
export function usePlaces(categorySlug?: string) {
  return useQuery({
    queryKey: ['places', categorySlug ?? 'all'],
    queryFn: async () => {
      const data = await fetchPlaces({ categorySlug })
      return placesOrDemo(data, categorySlug)
    },
    staleTime: 5 * 60_000,
  })
}

export function usePlace(slug: string | undefined) {
  return useQuery({
    queryKey: ['place', slug],
    queryFn: () => fetchPlaceBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 30 * 60_000,
  })
}

export function useFilteredPlaces(opts: {
  search?: string
  categorySlug?: string | null
  nearMe?: boolean
  verifiedOnly?: boolean
}) {
  const { data: places = [], isLoading, error, refetch } = usePlaces(opts.categorySlug ?? undefined)
  const { location } = useAppStore()

  const filtered = useMemo(() => {
    let list: Place[] = places
    if (opts.verifiedOnly) list = list.filter((p) => p.verified)
    if (opts.search) list = searchPlaces(list, opts.search)
    if (opts.nearMe && location.latitude != null && location.longitude != null) {
      return rankNearby(list, location.latitude, location.longitude, 8000)
    }
    return list
  }, [places, opts.search, opts.nearMe, opts.verifiedOnly, location.latitude, location.longitude])

  return { places: filtered, isLoading, error, refetch, total: places.length }
}
