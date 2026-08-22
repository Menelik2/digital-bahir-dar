import { supabase } from '@/lib/supabase'
import type { AdminMetrics, AdminUserRow } from '@/types/admin'
import type { Place } from '@/types/place'
import type { Review } from '@/types/social'
import type { PlaceClaim, BusinessProfile } from '@/types/business'

export type PlaceEditInput = {
  name: string
  slug?: string
  description?: string | null
  short_description?: string | null
  address?: string | null
  latitude?: number
  longitude?: number
  phone?: string | null
  email?: string | null
  website?: string | null
  price_level?: number | null
  entrance_fee?: number | null
  status?: string
  verified?: boolean
  featured?: boolean
  staff_notes?: string | null
}

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
      supabase.from('places').select('id, status, deleted_at', { count: 'exact' }),
      supabase.from('reviews').select('id, status', { count: 'exact' }),
      supabase.from('place_claims').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('business_profiles').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('review_reports').select('id', { count: 'exact' }).eq('status', 'open'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ])

    const placeRows = (places.data ?? []).filter((p) => !p.deleted_at)
    const reviewRows = reviews.data ?? []

    return {
      placesTotal: placeRows.length || places.count || 0,
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

export async function fetchPlacesForModeration(limit = 100): Promise<(Place & { staff_notes?: string | null; deleted_at?: string | null })[]> {
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
  })) as (Place & { staff_notes?: string | null; deleted_at?: string | null })[]
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

export async function updatePlace(
  placeId: string,
  input: PlaceEditInput
): Promise<{ error: string | null }> {
  const patch: Record<string, unknown> = {}
  if (input.name != null) patch.name = input.name.trim()
  if (input.slug != null && input.slug.trim()) patch.slug = input.slug.trim()
  if (input.description !== undefined) patch.description = input.description
  if (input.short_description !== undefined) patch.short_description = input.short_description
  if (input.address !== undefined) patch.address = input.address
  if (input.latitude != null && Number.isFinite(input.latitude)) patch.latitude = input.latitude
  if (input.longitude != null && Number.isFinite(input.longitude)) patch.longitude = input.longitude
  if (input.phone !== undefined) patch.phone = input.phone
  if (input.email !== undefined) patch.email = input.email
  if (input.website !== undefined) patch.website = input.website
  if (input.price_level !== undefined) patch.price_level = input.price_level
  if (input.entrance_fee !== undefined) patch.entrance_fee = input.entrance_fee
  if (input.status != null) patch.status = input.status
  if (input.verified !== undefined) patch.verified = input.verified
  if (input.featured !== undefined) patch.featured = input.featured
  if (input.staff_notes !== undefined) patch.staff_notes = input.staff_notes

  const { error } = await supabase.from('places').update(patch).eq('id', placeId)
  return { error: error?.message ?? null }
}

/** Soft delete — sets deleted_at, hides from public */
export async function softDeletePlace(placeId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('places')
    .update({ deleted_at: new Date().toISOString(), status: 'archived' })
    .eq('id', placeId)
  return { error: error?.message ?? null }
}

export async function restorePlace(placeId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('places')
    .update({ deleted_at: null, status: 'pending' })
    .eq('id', placeId)
  return { error: error?.message ?? null }
}

/** Permanent delete — requires staff DELETE policy */
export async function hardDeletePlace(placeId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('places').delete().eq('id', placeId)
  return { error: error?.message ?? null }
}

export async function setPlaceFeatured(
  placeId: string,
  featured: boolean
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('places').update({ featured }).eq('id', placeId)
  return { error: error?.message ?? null }
}

export async function setPlaceStaffNotes(
  placeId: string,
  staff_notes: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('places').update({ staff_notes }).eq('id', placeId)
  return { error: error?.message ?? null }
}

export async function bulkSetPlaceStatus(
  placeIds: string[],
  status: string,
  verified?: boolean
): Promise<{ error: string | null; count: number }> {
  if (placeIds.length === 0) return { error: null, count: 0 }
  const patch: Record<string, unknown> = { status }
  if (verified !== undefined) patch.verified = verified
  const { error, count } = await supabase.from('places').update(patch).in('id', placeIds)
  return { error: error?.message ?? null, count: count ?? placeIds.length }
}

export async function bulkSoftDeletePlaces(
  placeIds: string[]
): Promise<{ error: string | null }> {
  if (placeIds.length === 0) return { error: null }
  const { error } = await supabase
    .from('places')
    .update({ deleted_at: new Date().toISOString(), status: 'archived' })
    .in('id', placeIds)
  return { error: error?.message ?? null }
}

export async function fetchReviewsForModeration(limit = 100): Promise<Review[]> {
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

export async function updateReview(
  reviewId: string,
  patch: { rating?: number; title?: string | null; comment?: string | null; status?: string }
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('reviews').update(patch).eq('id', reviewId)
  return { error: error?.message ?? null }
}

export async function deleteReview(reviewId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
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

export async function fetchOpenReports(limit = 50) {
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

export async function fetchAdminUsers(limit = 100): Promise<AdminUserRow[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, created_at, avatar_url')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.warn('fetchAdminUsers:', error.message)
    return []
  }
  return (data ?? []) as AdminUserRow[]
}

/** Roles must match DB enum user_role */
export const PROFILE_ROLES = [
  'visitor',
  'business_owner',
  'tour_guide',
  'moderator',
  'admin',
] as const

export async function setUserRole(
  userId: string,
  role: string
): Promise<{ error: string | null }> {
  if (!(PROFILE_ROLES as readonly string[]).includes(role)) {
    return { error: `Invalid role. Use: ${PROFILE_ROLES.join(', ')}` }
  }
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
  return { error: error?.message ?? null }
}

export function downloadCsv(filename: string, rows: string[][]) {
  const esc = (c: string) => `"${String(c).replace(/"/g, '""')}"`
  const body = rows.map((r) => r.map(esc).join(',')).join('\n')
  const blob = new Blob([body], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
