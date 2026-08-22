import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchFavorites, isFavorited, addFavorite, removeFavorite } from '@/services/social'
import { useAuth } from './useAuth'

export function useFavorites() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => fetchFavorites(user!.id),
    enabled: !!user,
    staleTime: 60_000,
  })
}

export function useIsFavorited(placeId: string | undefined) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['favorite', user?.id, placeId],
    queryFn: () => isFavorited(user!.id, placeId!),
    enabled: !!user && !!placeId,
    staleTime: 30_000,
  })
}

export function useToggleFavorite(placeId: string) {
  const { user } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (currentlyFavorited: boolean) => {
      if (!user) throw new Error('Sign in to save places')
      if (currentlyFavorited) return removeFavorite(user.id, placeId)
      return addFavorite(user.id, placeId)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['favorite', user?.id, placeId] })
      qc.invalidateQueries({ queryKey: ['favorites', user?.id] })
    },
  })
}
