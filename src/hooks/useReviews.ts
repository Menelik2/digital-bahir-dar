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

export function useReviews(placeId: string | undefined) {
  const live = useReviewsRealtime(placeId)

  const query = useQuery({
    queryKey: ['reviews', placeId],
    queryFn: () => fetchReviews(placeId!),
    enabled: !!placeId,
    staleTime: 60_000,
  })

  return { ...query, realtime: live }
}

export function useMyReview(placeId: string | undefined) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['my-review', placeId, user?.id],
    queryFn: () => fetchMyReview(placeId!, user!.id),
    enabled: !!placeId && !!user,
  })
}

export function useRatingSummary(placeId: string | undefined) {
  return useQuery({
    queryKey: ['rating-summary', placeId],
    queryFn: () => getPlaceRatingSummary(placeId!),
    enabled: !!placeId,
    staleTime: 60_000,
  })
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', placeId] })
      qc.invalidateQueries({ queryKey: ['my-review', placeId] })
      qc.invalidateQueries({ queryKey: ['rating-summary', placeId] })
    },
  })
}

export function useDeleteReview(placeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await deleteReview(reviewId)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', placeId] })
      qc.invalidateQueries({ queryKey: ['my-review', placeId] })
      qc.invalidateQueries({ queryKey: ['rating-summary', placeId] })
    },
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
