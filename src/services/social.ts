import { supabase } from '@/lib/supabase'
import type { Review, Favorite, ReviewInput } from '@/types/social'
import type { Place } from '@/types/place'

export async function fetchReviews(placeId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profile:profiles(full_name, avatar_url)')
    .eq('place_id', placeId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('fetchReviews:', error.message)
    return []
  }
  return (data ?? []).map((r) => ({
    ...r,
    profile: Array.isArray(r.profile) ? r.profile[0] : r.profile,
  })) as Review[]
}

export async function fetchMyReview(placeId: string, userId: string): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('place_id', placeId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) return null
  return data as Review | null
}

export async function upsertReview(input: ReviewInput, userId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('reviews').upsert(
    {
      place_id: input.place_id,
      user_id: userId,
      rating: input.rating,
      title: input.title || null,
      comment: input.comment || null,
      status: 'published',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'place_id,user_id' }
  )
  return { error: error?.message ?? null }
}

export async function deleteReview(reviewId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
  return { error: error?.message ?? null }
}

export async function reportReview(
  reviewId: string,
  reporterId: string,
  reason: string,
  details?: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('review_reports').insert({
    review_id: reviewId,
    reporter_id: reporterId,
    reason,
    details: details || null,
  })
  return { error: error?.message ?? null }
}

export async function fetchFavorites(userId: string): Promise<Favorite[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('*, place:places(*, category:categories(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('fetchFavorites:', error.message)
    return []
  }
  return (data ?? []).map((f) => ({
    ...f,
    place: f.place
      ? {
          ...f.place,
          category: Array.isArray((f.place as Place).category)
            ? ((f.place as Place).category as unknown as Place['category'][])[0]
            : (f.place as Place).category,
        }
      : undefined,
  })) as Favorite[]
}

export async function isFavorited(userId: string, placeId: string): Promise<boolean> {
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('place_id', placeId)
    .maybeSingle()
  return !!data
}

export async function addFavorite(userId: string, placeId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('favorites').insert({ user_id: userId, place_id: placeId })
  return { error: error?.message ?? null }
}

export async function removeFavorite(userId: string, placeId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('favorites').delete().eq('user_id', userId).eq('place_id', placeId)
  return { error: error?.message ?? null }
}

export async function getPlaceRatingSummary(placeId: string): Promise<{ avg: number; count: number }> {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('place_id', placeId)
    .eq('status', 'published')
  if (error || !data?.length) return { avg: 0, count: 0 }
  const count = data.length
  const avg = data.reduce((s, r) => s + r.rating, 0) / count
  return { avg: Math.round(avg * 10) / 10, count }
}
