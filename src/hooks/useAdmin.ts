import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMyRole,
  fetchAdminMetrics,
  fetchPlacesForModeration,
  setPlaceStatus,
  setPlaceFeatured,
  setPlaceStaffNotes,
  bulkSetPlaceStatus,
  fetchReviewsForModeration,
  setReviewStatus,
  fetchPendingClaims,
  resolveClaim,
  fetchPendingBusinesses,
  setBusinessStatus,
  fetchOpenReports,
  resolveReport,
  fetchAdminUsers,
  setUserRole,
} from '@/services/admin'
import { useAuth } from './useAuth'
import { useAdminRealtime } from './useRealtimeQueries'

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
  useAdminRealtime(enabled)
  return useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => fetchAdminMetrics(),
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

export function useAdminUsers(enabled: boolean) {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => fetchAdminUsers(),
    enabled,
    staleTime: 30_000,
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
    qc.invalidateQueries({ queryKey: ['admin-users'] })
  }

  const placeStatus = useMutation({
    mutationFn: async (args: { placeId: string; status: string; verified?: boolean }) => {
      const res = await setPlaceStatus(args.placeId, args.status, args.verified)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const placeFeatured = useMutation({
    mutationFn: async (args: { placeId: string; featured: boolean }) => {
      const res = await setPlaceFeatured(args.placeId, args.featured)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const placeNotes = useMutation({
    mutationFn: async (args: { placeId: string; notes: string }) => {
      const res = await setPlaceStaffNotes(args.placeId, args.notes)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const bulkPlaces = useMutation({
    mutationFn: async (args: { placeIds: string[]; status: string; verified?: boolean }) => {
      const res = await bulkSetPlaceStatus(args.placeIds, args.status, args.verified)
      if (res.error) throw new Error(res.error)
      return res.count
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
    mutationFn: async (args: {
      businessId: string
      status: 'approved' | 'suspended' | 'pending'
    }) => {
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

  const userRole = useMutation({
    mutationFn: async (args: { userId: string; role: string }) => {
      const res = await setUserRole(args.userId, args.role)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  return {
    placeStatus,
    placeFeatured,
    placeNotes,
    bulkPlaces,
    reviewStatus,
    claim,
    business,
    report,
    userRole,
    invalidate,
  }
}
