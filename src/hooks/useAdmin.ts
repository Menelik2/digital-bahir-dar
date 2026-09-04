import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMyRole,
  fetchAdminMetrics,
  fetchPlacesForModeration,
  fetchCategoriesForAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchTransportForAdmin,
  setTransportVerified,
  updateTransportService,
  createPlace,
  setPlaceStatus,
  updatePlace,
  softDeletePlace,
  restorePlace,
  hardDeletePlace,
  setPlaceFeatured,
  setPlaceStaffNotes,
  bulkSetPlaceStatus,
  bulkSoftDeletePlaces,
  fetchReviewsForModeration,
  setReviewStatus,
  updateReview,
  deleteReview,
  bulkSetReviewStatus,
  fetchPendingClaims,
  resolveClaim,
  fetchPendingBusinesses,
  setBusinessStatus,
  fetchOpenReports,
  resolveReport,
  fetchAdminUsers,
  setUserRole,
  type PlaceEditInput,
  type PlaceCreateInput,
  type CategoryInput,
} from '@/services/admin'
import {
  fetchAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  setPlaceCoverImage,
  type CmsEventInput,
} from '@/services/cms'
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

export function useAdminCategories(enabled: boolean) {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => fetchCategoriesForAdmin(),
    enabled,
    staleTime: 60_000,
  })
}

export function useAdminTransport(enabled: boolean) {
  return useQuery({
    queryKey: ['admin-transport'],
    queryFn: () => fetchTransportForAdmin(),
    enabled,
    staleTime: 30_000,
  })
}

export function useAdminEvents(enabled: boolean) {
  return useQuery({
    queryKey: ['admin-events'],
    queryFn: () => fetchAdminEvents(),
    enabled,
    staleTime: 20_000,
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
    qc.invalidateQueries({ queryKey: ['admin-categories'] })
    qc.invalidateQueries({ queryKey: ['admin-transport'] })
    qc.invalidateQueries({ queryKey: ['admin-events'] })
    qc.invalidateQueries({ queryKey: ['city-events'] })
    qc.invalidateQueries({ queryKey: ['places'] })
  }

  const placeCreate = useMutation({
    mutationFn: async (data: PlaceCreateInput) => {
      const res = await createPlace(data, user?.id)
      if (res.error) throw new Error(res.error)
      return res.id
    },
    onSuccess: invalidate,
  })

  const placeStatus = useMutation({
    mutationFn: async (args: { placeId: string; status: string; verified?: boolean }) => {
      const res = await setPlaceStatus(args.placeId, args.status, args.verified)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const placeUpdate = useMutation({
    mutationFn: async (args: {
      placeId: string
      data: PlaceEditInput & { cover_image_url?: string | null }
    }) => {
      const { cover_image_url, ...rest } = args.data
      const res = await updatePlace(args.placeId, rest)
      if (res.error) throw new Error(res.error)
      if (cover_image_url !== undefined) {
        const img = await setPlaceCoverImage(args.placeId, cover_image_url)
        if (img.error) throw new Error(img.error)
      }
    },
    onSuccess: invalidate,
  })

  const placeSoftDelete = useMutation({
    mutationFn: async (placeId: string) => {
      const res = await softDeletePlace(placeId)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const placeRestore = useMutation({
    mutationFn: async (placeId: string) => {
      const res = await restorePlace(placeId)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const placeHardDelete = useMutation({
    mutationFn: async (placeId: string) => {
      const res = await hardDeletePlace(placeId)
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

  const bulkDelete = useMutation({
    mutationFn: async (placeIds: string[]) => {
      const res = await bulkSoftDeletePlaces(placeIds)
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

  const reviewUpdate = useMutation({
    mutationFn: async (args: {
      reviewId: string
      data: { rating?: number; title?: string | null; comment?: string | null; status?: string }
    }) => {
      const res = await updateReview(args.reviewId, args.data)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const reviewDelete = useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await deleteReview(reviewId)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const bulkReviews = useMutation({
    mutationFn: async (args: { reviewIds: string[]; status: string }) => {
      const res = await bulkSetReviewStatus(args.reviewIds, args.status)
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

  const categoryCreate = useMutation({
    mutationFn: async (data: CategoryInput) => {
      const res = await createCategory(data)
      if (res.error) throw new Error(res.error)
      return res.id
    },
    onSuccess: invalidate,
  })

  const categoryUpdate = useMutation({
    mutationFn: async (args: { id: string; data: Partial<CategoryInput> }) => {
      const res = await updateCategory(args.id, args.data)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const categoryDelete = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteCategory(id)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const transportVerified = useMutation({
    mutationFn: async (args: { id: string; verified: boolean }) => {
      const res = await setTransportVerified(args.id, args.verified)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const transportUpdate = useMutation({
    mutationFn: async (args: {
      id: string
      data: Partial<{
        service_type: string
        provider_name: string
        phone: string | null
        estimated_price_min: number | null
        estimated_price_max: number | null
        route_description: string | null
        verified: boolean
      }>
    }) => {
      const res = await updateTransportService(args.id, args.data)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const eventCreate = useMutation({
    mutationFn: async (data: CmsEventInput) => {
      const res = await createEvent(data)
      if (res.error) throw new Error(res.error)
      return res.id
    },
    onSuccess: invalidate,
  })

  const eventUpdate = useMutation({
    mutationFn: async (args: { id: string; data: Partial<CmsEventInput> }) => {
      const res = await updateEvent(args.id, args.data)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  const eventDelete = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteEvent(id)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: invalidate,
  })

  return {
    placeCreate,
    placeStatus,
    placeUpdate,
    placeSoftDelete,
    placeRestore,
    placeHardDelete,
    placeFeatured,
    placeNotes,
    bulkPlaces,
    bulkDelete,
    reviewStatus,
    reviewUpdate,
    reviewDelete,
    bulkReviews,
    claim,
    business,
    report,
    userRole,
    categoryCreate,
    categoryUpdate,
    categoryDelete,
    transportVerified,
    transportUpdate,
    eventCreate,
    eventUpdate,
    eventDelete,
    invalidate,
  }
}
