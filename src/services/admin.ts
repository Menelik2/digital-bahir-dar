import { supabase } from '@/lib/supabase'
import type { AdminMetrics } from '@/types/admin'
import type { Place } from '@/types/place'
import type { Review } from '@/types/social'
import type { PlaceClaim, BusinessProfile } from '@/types/business'

export async function fetchMyRole(userId: string): Promise<string | null> {
  const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()
  if (error) {
    console.warn('fetchMyRole:', error.message)
    return null
  }
  return (data?.role as string) ?? null
}

export async function fetchAdminMetrics(): Promise<AdminMetrics> {
  const empty: AdminMetrics = {
    placesTotal: 0,
    placesPublished: 0,
    placesPending: 0,
    reviewsTotal: 0,
    reviewsHidden: 0,
    claimsPending: 0,
    businessesPending: 0,
    reportsOpen: 0,
    usersApprox: 0,
  }
  try {
    const [places, reviews, claims, businesses, reports, profiles] = await Promise.all([
      supabase.from('places').select('id, status', { count: 'exact' }),
      supabase.from('reviews').select('id, status', { count: 'exact' }),
      supabase.from('place_claims').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('business_profiles').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('review_reports').select('id', { count: 'exact' }).eq('status', 'open'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ])

    const placeRows = places.data ?? []
    const reviewRows = reviews.data ?? []

    return {
      placesTotal: places.count ?? placeRows.length,
      placesPublished: placeRows.filter((p) => p.status === 'published').length,
      placesPending: placeRows.filter((p) => p.status === 'pending').length,
      reviewsTotal: reviews.count ?? reviewRows.length,
      reviewsHidden: reviewRows.filter((r) => r.status === 'hidden').length,
      claimsPending: claims.count ?? 0,
      businessesPending: businesses.count ?? 0,
      reportsOpen: reports.count ?? 0,
      usersApprox: profiles.count ?? 0,
    }
  } catch (e) {
    console.warn('fetchAdminMetrics:', e)
    return empty
  }
}

export async function fetchPlacesForModeration(limit = 50): Promise<Place[]> {
  const { data, error } = await supabase
    .from('places')
    .select('*, category:categories(name)')
    .order('updated_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.warn('fetchPlacesForModeration:', error.message)
    return []
  }
  return (data ?? []).map((p) => ({
    ...p,
    category: Array.isArray(p.category) ? p.category[0] : p.category,
  })) as Place[]
}

export async function setPlaceStatus(
  placeId: string,
  status: string,
  verified?: boolean
): Promise<{ error: string | null }> {
  const patch: Record<string, unknown> = { status }
  if (verified !== undefined) patch.verified = verified
  const { error } = await supabase.from('places').update(patch).eq('id', placeId)
  return { error: error?.message ?? null }
}

export async function fetchReviewsForModeration(limit = 50): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profile:profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.warn('fetchReviewsForModeration:', error.message)
    return []
  }
  return (data ?? []).map((r) => ({
    ...r,
    profile: Array.isArray(r.profile) ? r.profile[0] : r.profile,
  })) as Review[]
}

export async function setReviewStatus(reviewId: string, status: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('reviews').update({ status }).eq('id', reviewId)
  return { error: error?.message ?? null }
}

export async function fetchPendingClaims(): Promise<PlaceClaim[]> {
  const { data, error } = await supabase
    .from('place_claims')
    .select('*, place:places(id, name, slug, address)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  if (error) {
    console.warn('fetchPendingClaims:', error.message)
    return []
  }
  return (data ?? []).map((c) => ({
    ...c,
    place: Array.isArray(c.place) ? c.place[0] : c.place,
  })) as PlaceClaim[]
}

export async function resolveClaim(
  claimId: string,
  approve: boolean,
  reviewerId: string
): Promise<{ error: string | null }> {
  const { data: claim, error: fetchErr } = await supabase
    .from('place_claims')
    .select('*')
    .eq('id', claimId)
    .single()
  if (fetchErr || !claim) return { error: fetchErr?.message ?? 'Claim not found' }

  const { error } = await supabase
    .from('place_claims')
    .update({
      status: approve ? 'approved' : 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId,
    })
    .eq('id', claimId)
  if (error) return { error: error.message }

  if (approve && claim.business_profile_id) {
    const { error: placeErr } = await supabase
      .from('places')
      .update({ owner_business_id: claim.business_profile_id, verified: true })
      .eq('id', claim.place_id)
    if (placeErr) return { error: placeErr.message }
  }
  return { error: null }
}

export async function fetchPendingBusinesses(): Promise<BusinessProfile[]> {
  const { data, error } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  if (error) {
    console.warn('fetchPendingBusinesses:', error.message)
    return []
  }
  return (data ?? []) as BusinessProfile[]
}

export async function setBusinessStatus(
  businessId: string,
  status: 'approved' | 'suspended' | 'pending'
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('business_profiles').update({ status }).eq('id', businessId)
  return { error: error?.message ?? null }
}

export async function fetchOpenReports(limit = 30) {
  const { data, error } = await supabase
    .from('review_reports')
    .select('*, review:reviews(id, comment, rating, place_id)')
    .eq('status', 'open')
    .order('created_at', { ascending: true })
    .limit(limit)
  if (error) {
    console.warn('fetchOpenReports:', error.message)
    return []
  }
  return data ?? []
}

export async function resolveReport(
  reportId: string,
  status: 'resolved' | 'dismissed'
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('review_reports').update({ status }).eq('id', reportId)
  return { error: error?.message ?? null }
}

export function demoAdminMetrics(): AdminMetrics {
  return {
    placesTotal: 12,
    placesPublished: 10,
    placesPending: 2,
    reviewsTotal: 8,
    reviewsHidden: 1,
    claimsPending: 3,
    businessesPending: 2,
    reportsOpen: 1,
    usersApprox: 25,
  }
}
