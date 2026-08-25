import { supabase } from '@/lib/supabase'
import type {
  BusinessProfile,
  PlaceClaim,
  BusinessProfileInput,
  BusinessAnalytics,
} from '@/types/business'
import type { Place } from '@/types/place'

export async function fetchMyBusinessProfile(userId: string): Promise<BusinessProfile | null> {
  const { data, error } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) {
    console.warn('fetchMyBusinessProfile:', error.message)
    return null
  }
  return data as BusinessProfile | null
}

export async function upsertBusinessProfile(
  userId: string,
  input: BusinessProfileInput
): Promise<{ profile: BusinessProfile | null; error: string | null }> {
  const existing = await fetchMyBusinessProfile(userId)
  if (existing) {
    const { data, error } = await supabase
      .from('business_profiles')
      .update({
        business_name: input.business_name,
        contact_name: input.contact_name || null,
        phone: input.phone || null,
        email: input.email || null,
        website: input.website || null,
        description: input.description || null,
      })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) return { profile: null, error: error.message }
    return { profile: data as BusinessProfile, error: null }
  }
  const { data, error } = await supabase
    .from('business_profiles')
    .insert({
      user_id: userId,
      business_name: input.business_name,
      contact_name: input.contact_name || null,
      phone: input.phone || null,
      email: input.email || null,
      website: input.website || null,
      description: input.description || null,
      status: 'pending',
    })
    .select()
    .single()
  if (error) return { profile: null, error: error.message }
  return { profile: data as BusinessProfile, error: null }
}

export async function fetchMyClaims(userId: string): Promise<PlaceClaim[]> {
  const { data, error } = await supabase
    .from('place_claims')
    .select('*, place:places(id, name, slug, address)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) {
    console.warn('fetchMyClaims:', error.message)
    return []
  }
  return (data ?? []).map((c) => ({
    ...c,
    place: Array.isArray(c.place) ? c.place[0] : c.place,
  })) as PlaceClaim[]
}

export async function submitPlaceClaim(
  userId: string,
  placeId: string,
  message?: string,
  businessProfileId?: string
): Promise<{ claim: PlaceClaim | null; error: string | null }> {
  const { data, error } = await supabase
    .from('place_claims')
    .insert({
      user_id: userId,
      place_id: placeId,
      message: message || null,
      business_profile_id: businessProfileId || null,
      status: 'pending',
    })
    .select()
    .single()
  if (error) return { claim: null, error: error.message }
  return { claim: data as PlaceClaim, error: null }
}

export async function fetchOwnedPlaces(businessProfileId: string): Promise<Place[]> {
  const { data, error } = await supabase
    .from('places')
    .select('*, category:categories(*)')
    .eq('owner_business_id', businessProfileId)
    .order('name')
  if (error) {
    console.warn('fetchOwnedPlaces:', error.message)
    return []
  }
  return (data ?? []).map((p) => ({
    ...p,
    category: Array.isArray(p.category) ? p.category[0] : p.category,
  })) as Place[]
}

export async function updateOwnedPlace(
  placeId: string,
  patch: {
    description?: string
    short_description?: string
    phone?: string
    website?: string
    address?: string
  }
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('places').update(patch).eq('id', placeId)
  return { error: error?.message ?? null }
}

export async function searchPlacesForClaim(query: string): Promise<Place[]> {
  if (!query.trim()) return []
  const { data, error } = await supabase
    .from('places')
    .select('id, name, slug, address, category:categories(name)')
    .ilike('name', `%${query.trim()}%`)
    .eq('status', 'published')
    .limit(15)
  if (error) {
    console.warn('searchPlacesForClaim:', error.message)
    return []
  }
  return (data ?? []).map((p) => ({
    ...p,
    category: Array.isArray(p.category) ? p.category[0] : p.category,
  })) as Place[]
}

/** Aggregate reviews for owned place IDs */
export async function fetchOwnedPlaceReviewStats(placeIds: string[]): Promise<{
  totalReviews: number
  avgRating: number | null
}> {
  if (placeIds.length === 0) return { totalReviews: 0, avgRating: null }
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .in('place_id', placeIds)
    .eq('status', 'published')
  if (error || !data?.length) {
    if (error) console.warn('fetchOwnedPlaceReviewStats:', error.message)
    return { totalReviews: 0, avgRating: null }
  }
  const totalReviews = data.length
  const avgRating = data.reduce((s, r) => s + (r.rating || 0), 0) / totalReviews
  return { totalReviews, avgRating: Math.round(avgRating * 10) / 10 }
}

export async function computeBusinessAnalytics(
  profile: BusinessProfile | null,
  claims: PlaceClaim[],
  owned: Place[]
): Promise<BusinessAnalytics> {
  const placeIds = owned.map((p) => p.id)
  const { totalReviews, avgRating } = await fetchOwnedPlaceReviewStats(placeIds)
  return {
    ownedPlaces: owned.length,
    pendingClaims: claims.filter((c) => c.status === 'pending').length,
    approvedClaims: claims.filter((c) => c.status === 'approved').length,
    profileStatus: profile?.status ?? null,
    publishedPlaces: owned.filter((p) => p.status === 'published').length,
    verifiedPlaces: owned.filter((p) => p.verified).length,
    totalReviews,
    avgRating,
  }
}

/** @deprecated use computeBusinessAnalytics for full stats */
export function computeAnalytics(
  profile: BusinessProfile | null,
  claims: PlaceClaim[],
  ownedCount: number
): BusinessAnalytics {
  return {
    ownedPlaces: ownedCount,
    pendingClaims: claims.filter((c) => c.status === 'pending').length,
    approvedClaims: claims.filter((c) => c.status === 'approved').length,
    profileStatus: profile?.status ?? null,
  }
}

export function createDemoBusiness(userId: string): {
  profile: BusinessProfile
  claims: PlaceClaim[]
} {
  const profile: BusinessProfile = {
    id: 'demo-biz-1',
    user_id: userId,
    business_name: 'Lakeside Hospitality (DEMO)',
    contact_name: 'Demo Owner',
    phone: '+251 58 000 0000',
    email: 'demo@example.com',
    website: null,
    description: 'DEMO business profile for portal UI. Register a real profile after migrations.',
    city: 'Bahir Dar',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  const claims: PlaceClaim[] = [
    {
      id: 'demo-claim-1',
      place_id: 'demo-place',
      user_id: userId,
      business_profile_id: profile.id,
      message: 'We operate this property (DEMO claim).',
      status: 'pending',
      reviewed_at: null,
      created_at: new Date().toISOString(),
      place: {
        id: 'demo-place',
        name: 'Sample Hotel (DEMO)',
        slug: 'sample-hotel-demo',
        address: 'Bahir Dar lakeside',
      },
    },
  ]
  return { profile, claims }
}
