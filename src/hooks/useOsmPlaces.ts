import { useQuery } from '@tanstack/react-query'
import { fetchOsmPlaces, type OsmCategory } from '@/services/osmPlaces'

/**
 * Long staleTime reduces Overpass hits while users switch Hotels / Restaurants / Discover.
 * Memory cache in osmPlaces.ts is an extra 15‑minute layer.
 */
export function useOsmPlaces(categories: OsmCategory[] = ['all'], enabled = true) {
  return useQuery({
    queryKey: ['osm-places', categories.slice().sort().join(',')],
    queryFn: () => fetchOsmPlaces({ categories }),
    enabled,
    staleTime: 15 * 60_000,
    gcTime: 30 * 60_000,
    retry: (count, err) => {
      const msg = String((err as Error)?.message || '')
      if (msg.includes('429')) return count < 1 // one soft retry after library backoff
      return count < 1
    },
    refetchOnWindowFocus: false,
  })
}

export function useOsmHotels() {
  return useOsmPlaces(['hotel'])
}

export function useOsmFood() {
  return useOsmPlaces(['restaurant', 'cafe'])
}

export function useOsmTravel() {
  return useOsmPlaces(['attraction', 'transport'])
}
