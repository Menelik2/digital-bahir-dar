import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchReviews,
  fetchMyReview,
  upsertReview,
  deleteReview,
  reportReview,
  getPlaceRatingSummary,
} from '@/services/social'
import type { ReviewInput } from '@/types/social'
import { useAuth } from './useAuth'
import { useReviewsRealtime } from './useRealtimeQueries'
import { qk } from '@/lib/queryKeys'

export function useReviews(placeId: string | undefined) {
  const live = useReviewsRealtime(placeId)

  const query = useQuery({
    queryKey: placeId ? qk.reviews.list(placeId) : ['reviews', 'none'],
    queryFn: () => fetchReviews(placeId!),
    enabled: !!placeId,
    staleTime: 60_000,
  })

  return { ...query, realtime: live }
}

export function useMyReview(placeId: string | undefined) {
  const { user } = useAuth()
  return useQuery({
    queryKey: placeId ? qk.reviews.mine(placeId, user?.id) : ['my-review', 'none'],
    queryFn: () => fetchMyReview(placeId!, user!.id),
    enabled: !!placeId && !!user,
  })
}

export function useRatingSummary(placeId: string | undefined) {
  return useQuery({
    queryKey: placeId ? qk.reviews.summary(placeId) : ['rating-summary', 'none'],
    queryFn: () => getPlaceRatingSummary(placeId!),
    enabled: !!placeId,
    staleTime: 60_000,
  })
}

function invalidateReviewQueries(qc: ReturnType<typeof useQueryClient>, placeId: string) {
  void qc.invalidateQueries({ queryKey: qk.reviews.list(placeId) })
  void qc.invalidateQueries({ queryKey: qk.reviews.minePrefix(placeId) })
  void qc.invalidateQueries({ queryKey: qk.reviews.summary(placeId) })
}

export function useUpsertReview(placeId: string) {
  const { user } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<ReviewInput, 'place_id'>) => {
      if (!user) throw new Error('Sign in to leave a review')
      const res = await upsertReview({ ...input, place_id: placeId }, user.id)
      if (res.error) throw new Error(res.error)
    },
    // Optimistic local sync; realtime will also refresh other tabs
    onSuccess: () => invalidateReviewQueries(qc, placeId),
  })
}

export function useDeleteReview(placeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await deleteReview(reviewId)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: () => invalidateReviewQueries(qc, placeId),
  })
}

export function useReportReview() {
  const { user } = useAuth()
  return useMutation({
    mutationFn: async ({
      reviewId,
      reason,
      details,
    }: {
      reviewId: string
      reason: string
      details?: string
    }) => {
      if (!user) throw new Error('Sign in to report')
      const res = await reportReview(reviewId, user.id, reason, details)
      if (res.error) throw new Error(res.error)
    },
  })
}
