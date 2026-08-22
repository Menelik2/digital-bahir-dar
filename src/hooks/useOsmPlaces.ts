import { useQuery } from '@tanstack/react-query'
import { fetchOsmPlaces, type OsmCategory } from '@/services/osmPlaces'

export function useOsmPlaces(categories: OsmCategory[] = ['all'], enabled = true) {
  return useQuery({
    queryKey: ['osm-places', categories.slice().sort().join(',')],
    queryFn: () => fetchOsmPlaces({ categories }),
    enabled,
    staleTime: 10 * 60_000,
    retry: 1,
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
