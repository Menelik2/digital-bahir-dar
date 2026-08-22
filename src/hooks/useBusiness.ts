import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMyBusinessProfile,
  upsertBusinessProfile,
  fetchMyClaims,
  submitPlaceClaim,
  fetchOwnedPlaces,
  updateOwnedPlace,
  searchPlacesForClaim,
} from '@/services/business'
import type { BusinessProfileInput } from '@/types/business'
import { useAuth } from './useAuth'

export function useMyBusinessProfile() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['business-profile', user?.id],
    queryFn: async () => {
      if (!user) return null
      return fetchMyBusinessProfile(user.id)
    },
    enabled: !!user,
    staleTime: 30_000,
  })
}

export function useMyClaims() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['place-claims', user?.id],
    queryFn: async () => {
      if (!user) return []
      return fetchMyClaims(user.id)
    },
    enabled: !!user,
    staleTime: 30_000,
  })
}

export function useOwnedPlaces(businessProfileId: string | undefined) {
  return useQuery({
    queryKey: ['owned-places', businessProfileId],
    queryFn: () => fetchOwnedPlaces(businessProfileId!),
    enabled: !!businessProfileId && !businessProfileId.startsWith('demo-'),
    staleTime: 30_000,
  })
}

export function useUpsertBusinessProfile() {
  const { user } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: BusinessProfileInput) => {
      if (!user) throw new Error('Sign in required')
      const res = await upsertBusinessProfile(user.id, input)
      if (res.error) throw new Error(res.error)
      return res.profile!
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['business-profile', user?.id] }),
  })
}

export function useSubmitClaim() {
  const { user } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (args: { placeId: string; message?: string; businessProfileId?: string }) => {
      if (!user) throw new Error('Sign in required')
      const res = await submitPlaceClaim(user.id, args.placeId, args.message, args.businessProfileId)
      if (res.error) throw new Error(res.error)
      return res.claim!
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['place-claims', user?.id] }),
  })
}

export function useUpdateOwnedPlace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (args: {
      placeId: string
      patch: {
        description?: string
        short_description?: string
        phone?: string
        website?: string
        address?: string
      }
    }) => {
      const res = await updateOwnedPlace(args.placeId, args.patch)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['owned-places'] }),
  })
}

export function useSearchPlacesForClaim(query: string) {
  return useQuery({
    queryKey: ['claim-search', query],
    queryFn: () => searchPlacesForClaim(query),
    enabled: query.trim().length >= 2,
    staleTime: 15_000,
  })
}
