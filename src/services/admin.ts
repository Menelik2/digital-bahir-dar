import { supabase } from '@/lib/supabase'
import type { AdminMetrics, AdminUserRow } from '@/types/admin'
import type { Place, Category, TransportService } from '@/types/place'
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
  category_id?: string
}

export type PlaceCreateInput = {
  name: string
  slug: string
  category_id: string
  description?: string | null
  short_description?: string | null
  address?: string | null
  latitude: number
  longitude: number
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

export type CategoryInput = {
  name: string
  slug: string
  icon?: string | null
  description?: string | null
  sort_order?: number
  name_am?: string | null
}

export type TransportCreateInput = {
  service_type: string
  provider_name: string
  phone?: string | null
  estimated_price_min?: number | null
  estimated_price_max?: number | null
  route_description?: string | null
  verified?: boolean
}

export async function fetchMyRole(userId: string): Promise<string | null> {
  const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()
  if (error) {
    console.warn('fetchMyRole:', error.message)
    return null
  }
  return (data?.role as string) ?? null
}

export async function fetchAdminMetrics(): Promise<
  AdminMetrics & {
    placesFeatured: number
    placesDraft: number
    placesArchived: number
    reviewsPending: number
    businessesApproved: number
    businessesSuspended: number
    categoriesTotal: number
    transportTotal: number
  }
> {
  const empty = {
    placesTotal: 0,
    placesPublished: 0,
    placesPending: 0,
    placesFeatured: 0,
    placesDraft: 0,
    placesArchived: 0,
    reviewsTotal: 0,
    reviewsHidden: 0,
    reviewsPending: 0,
    claimsPending: 0,
    businessesPending: 0,
    businessesApproved: 0,
    businessesSuspended: 0,
    reportsOpen: 0,
    usersApprox: 0,
    categoriesTotal: 0,
    transportTotal: 0,
  }
  try {
    const [places, reviews, claims, businesses, reports, profiles, cats, transport] = await Promise.all([
      supabase.from('places').select('id, status, verified, featured, deleted_at', { count: 'exact' }),
      supabase.from('reviews').select('id, status', { count: 'exact' }),
      supabase.from('place_claims').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('business_profiles').select('id, status', { count: 'exact' }),
      supabase.from('review_reports').select('id', { count: 'exact' }).eq('status', 'open'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }),
      supabase.from('transport_services').select('id', { count: 'exact', head: true }),
    ])

    const placeRows = (places.data ?? []).filter((p) => !p.deleted_at)
    const reviewRows = reviews.data ?? []
    const bizRows = businesses.data ?? []

    return {
      placesTotal: placeRows.length || places.count || 0,
      placesPublished: placeRows.filter((p) => p.status === 'published').length,
      placesPending: placeRows.filter((p) => p.status === 'pending').length,
      placesFeatured: placeRows.filter((p) => p.featured).length,
      placesDraft: placeRows.filter((p) => p.status === 'draft').length,
      placesArchived: placeRows.filter((p) => p.status === 'archived').length,
      reviewsTotal: reviews.count ?? reviewRows.length,
      reviewsHidden: reviewRows.filter((r) => r.status === 'hidden').length,
      reviewsPending: reviewRows.filter((r) => r.status === 'pending').length,
      claimsPending: claims.count ?? 0,
      businessesPending: bizRows.filter((b) => b.status === 'pending').length || (businesses.count ?? 0),
      businessesApproved: bizRows.filter((b) => b.status === 'approved').length,
      businessesSuspended: bizRows.filter((b) => b.status === 'suspended').length,
      reportsOpen: reports.count ?? 0,
      usersApprox: profiles.count ?? 0,
      categoriesTotal: cats.count ?? 0,
      transportTotal: transport.count ?? 0,
    }
  } catch (e) {
    console.warn('fetchAdminMetrics:', e)
    return empty
  }
}

export async function fetchCategoriesForAdmin(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('sort_order')
  if (error) {
    console.warn('fetchCategoriesForAdmin:', error.message)
    return []
  }
  return (data ?? []) as Category[]
}

export async function createCategory(input: CategoryInput): Promise<{ error: string | null; id?: string }> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: input.name.trim(),
      slug: input.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      icon: input.icon ?? null,
      description: input.description ?? null,
      sort_order: input.sort_order ?? 99,
      name_am: input.name_am ?? null,
    })
    .select('id')
    .single()
  if (error) return { error: error.message }
  return { error: null, id: data?.id }
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>
): Promise<{ error: string | null }> {
  const patch: Record<string, unknown> = {}
  if (input.name != null) patch.name = input.name.trim()
  if (input.slug != null) patch.slug = input.slug.trim().toLowerCase().replace(/\s+/g, '-')
  if (input.icon !== undefined) patch.icon = input.icon
  if (input.description !== undefined) patch.description = input.description
  if (input.sort_order !== undefined) patch.sort_order = input.sort_order
  if (input.name_am !== undefined) patch.name_am = input.name_am
  const { error } = await supabase.from('categories').update(patch).eq('id', id)
  return { error: error?.message ?? null }
}

export async function deleteCategory(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  return { error: error?.message ?? null }
}
