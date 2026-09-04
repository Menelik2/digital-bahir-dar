import { supabase } from '@/lib/supabase'

export type TransportCreateInput = {
  service_type: string
  provider_name: string
  phone?: string | null
  estimated_price_min?: number | null
  estimated_price_max?: number | null
  currency?: string
  route_description?: string | null
  verified?: boolean
  place_id?: string | null
}

export async function createTransportService(
  input: TransportCreateInput
): Promise<{ error: string | null; id?: string }> {
  const row = {
    service_type: input.service_type.trim(),
    provider_name: input.provider_name.trim(),
    phone: input.phone ?? null,
    estimated_price_min: input.estimated_price_min ?? null,
    estimated_price_max: input.estimated_price_max ?? null,
    currency: input.currency || 'ETB',
    route_description: input.route_description ?? null,
    verified: input.verified ?? false,
    place_id: input.place_id ?? null,
    last_price_updated_at: new Date().toISOString(),
  }
  const { data, error } = await supabase
    .from('transport_services')
    .insert(row)
    .select('id')
    .single()
  if (error) return { error: error.message }
  return { error: null, id: data?.id }
}

export async function deleteTransportService(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('transport_services').delete().eq('id', id)
  return { error: error?.message ?? null }
}

/** Lightweight activity feed for the overview panel */
export async function fetchAdminActivity(limit = 12): Promise<
  { id: string; at: string; action: string; detail: string }[]
> {
  const items: { id: string; at: string; action: string; detail: string }[] = []
  try {
    const [places, reviews, claims, reports] = await Promise.all([
      supabase
        .from('places')
        .select('id, name, status, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5),
      supabase
        .from('reviews')
        .select('id, rating, status, created_at, place:places(name)')
        .order('created_at', { ascending: false })
        .limit(4),
      supabase
        .from('place_claims')
        .select('id, status, created_at, place:places(name)')
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('review_reports')
        .select('id, reason, status, created_at')
        .order('created_at', { ascending: false })
        .limit(3),
    ])

    for (const p of places.data ?? []) {
      items.push({
        id: `place-${p.id}`,
        at: p.updated_at,
        action: `Place · ${p.status}`,
        detail: p.name,
      })
    }
    for (const r of reviews.data ?? []) {
      const place = Array.isArray(r.place) ? r.place[0] : r.place
      items.push({
        id: `review-${r.id}`,
        at: r.created_at,
        action: `Review · ${r.rating}★ · ${r.status}`,
        detail: (place as { name?: string } | null)?.name ?? 'Review',
      })
    }
    for (const c of claims.data ?? []) {
      const place = Array.isArray(c.place) ? c.place[0] : c.place
      items.push({
        id: `claim-${c.id}`,
        at: c.created_at,
        action: `Claim · ${c.status}`,
        detail: (place as { name?: string } | null)?.name ?? 'Claim',
      })
    }
    for (const r of reports.data ?? []) {
      items.push({
        id: `report-${r.id}`,
        at: r.created_at,
        action: `Report · ${r.status ?? 'open'}`,
        detail: r.reason,
      })
    }

    items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    return items.slice(0, limit)
  } catch (e) {
    console.warn('fetchAdminActivity:', e)
    return []
  }
}
