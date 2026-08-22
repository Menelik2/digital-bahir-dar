import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMyRole,
  fetchAdminMetrics,
  fetchPlacesForModeration,
  setPlaceStatus,
  fetchReviewsForModeration,
  setReviewStatus,
  fetchPendingClaims,
  resolveClaim,
  fetchPendingBusinesses,
  setBusinessStatus,
  fetchOpenReports,
  resolveReport,
  demoAdminMetrics,
} from '@/services/admin'
import { useAuth } from './useAuth'

export function useIsStaff() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['my-role', user?.id],
    queryFn: async () => {
      if (!user) return { role: null, isStaff: false }
      const role = await fetchMyRole(user.id)
      const isStaff = role === 'admin' || role === 'moderator'
      return { role, isStaff }
    },
    enabled: !!user,
    staleTime: 60_000,
  })
}

export function useAdminMetrics(enabled: boolean) {
  return useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const m = await fetchAdminMetrics()
      if (m.placesTotal === 0 && m.usersApprox === 0) return demoAdminMetrics()
      return m
    },
    enabled,
    staleTime: 30_000,
  })
}

export function useModerationPlaces(enabled: boolean) {
  return useQuery({
    queryKey: ['admin-places'],
    queryFn: () => fetchPlacesForModeration(),
    enabled,
    staleTime: 20_000,
  })
}

export function useModerationReviews(enabled: boolean) {
  return useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => fetchReviewsForModeration(),
    enabled,
    staleTime: 20_000,
  })
}

export function usePendingClaims(enabled: boolean) {
  return useQuery({
    queryKey: ['admin-claims'],
    queryFn: () => fetchPendingClaims(),
    enabled,
    staleTime: 20_000,
  })
}

export function usePendingBusinesses(enabled: boolean) {
  return useQuery({
    queryKey: ['admin-businesses'],
    queryFn: () => fetchPendingBusinesses(),
    enabled,
    staleTime: 20_000,
  })
}

export function useOpenReports(enabled: boolean) {
  return useQuery({
    queryKey: ['admin-reports'],
    queryFn: () => fetchOpenReports(),
    enabled,
    staleTime: 20_000,
  })
}

export function useAdminActions() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-metrics'] })
    qc.invalidateQueries({ queryKey: ['admin-places'] })
    qc.invalidateQueries({ queryKey: ['admin-reviews'] })
    qc.invalidateQueries({ queryKey: ['admin-claims'] })
    qc.invalidateQueries({ queryKey: ['admin-businesses'] })
    qc.invalidateQueries({ queryKey: ['admin-reports'] })
  }

  const placeStatus = useMutation({
    mutationFn: async (args: { placeId: string; status: string; verified?: boolean }) => {
      const res = await setPlaceStatus(args.placeId, args.status, args.verified)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const reviewStatus = useMutation({
    mutationFn: async (args: { reviewId: string; status: string }) => {
      const res = await setReviewStatus(args.reviewId, args.status)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const claim = useMutation({
    mutationFn: async (args: { claimId: string; approve: boolean }) => {
      if (!user) throw new Error('Not signed in')
      const res = await resolveClaim(args.claimId, args.approve, user.id)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const business = useMutation({
    mutationFn: async (args: { businessId: string; status: 'approved' | 'suspended' | 'pending' }) => {
      const res = await setBusinessStatus(args.businessId, args.status)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const report = useMutation({
    mutationFn: async (args: { reportId: string; status: 'resolved' | 'dismissed' }) => {
      const res = await resolveReport(args.reportId, args.status)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  return { placeStatus, reviewStatus, claim, business, report }
}
