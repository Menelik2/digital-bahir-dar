import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchFavorites, isFavorited, addFavorite, removeFavorite } from '@/services/social'
import { useAuth } from './useAuth'
import { qk } from '@/lib/queryKeys'

export function useFavorites() {
  const { user } = useAuth()

  return useQuery({
    queryKey: user ? qk.favorites.list(user.id) : ['favorites', 'anon'],
    queryFn: () => fetchFavorites(user!.id),
    enabled: !!user,
    staleTime: 60_000,
  })
}

export function useIsFavorited(placeId: string | undefined) {
  const { user } = useAuth()
  return useQuery({
    queryKey:
      user && placeId ? qk.favorites.one(user.id, placeId) : ['favorite', 'anon'],
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
    onMutate: async (currentlyFavorited) => {
      if (!user) return
      await qc.cancelQueries({ queryKey: qk.favorites.one(user.id, placeId) })
      const prev = qc.getQueryData<boolean>(qk.favorites.one(user.id, placeId))
      qc.setQueryData(qk.favorites.one(user.id, placeId), !currentlyFavorited)
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (user && ctx && 'prev' in ctx) {
        qc.setQueryData(qk.favorites.one(user.id, placeId), ctx.prev)
      }
    },
    onSettled: () => {
      if (!user) return
      void qc.invalidateQueries({ queryKey: qk.favorites.one(user.id, placeId) })
      void qc.invalidateQueries({ queryKey: qk.favorites.list(user.id) })
    },
  })
}
