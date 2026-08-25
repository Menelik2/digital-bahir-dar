/** CMS helpers — visual content management without code */
import { supabase } from '@/lib/supabase'

export type CmsEventInput = {
  title: string
  title_am?: string | null
  date_label: string
  time_label?: string | null
  venue: string
  category: 'culture' | 'music' | 'market' | 'sports' | 'community' | 'seasonal'
  description: string
  price_label?: string
  featured?: boolean
  status?: 'draft' | 'published' | 'archived'
  sort_order?: number
}

export type CmsEventRow = CmsEventInput & {
  id: string
  created_at?: string
  updated_at?: string
}

export async function fetchAdminEvents(): Promise<CmsEventRow[]> {
  const { data, error } = await supabase
    .from('city_events')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('updated_at', { ascending: false })
  if (error) {
    console.warn('fetchAdminEvents:', error.message)
    return []
  }
  return (data ?? []) as CmsEventRow[]
}

export async function createEvent(input: CmsEventInput): Promise<{ error: string | null; id?: string }> {
  const { data, error } = await supabase
    .from('city_events')
    .insert({
      title: input.title.trim(),
      title_am: input.title_am ?? null,
      date_label: input.date_label.trim(),
      time_label: input.time_label ?? null,
      venue: input.venue.trim(),
      category: input.category,
      description: input.description.trim(),
      price_label: input.price_label ?? 'Check locally',
      featured: input.featured ?? false,
      status: input.status ?? 'published',
      sort_order: input.sort_order ?? 50,
    })
    .select('id')
    .single()
  if (error) return { error: error.message }
  return { error: null, id: data?.id }
}

export async function updateEvent(
  id: string,
  input: Partial<CmsEventInput>
): Promise<{ error: string | null }> {
  const patch: Record<string, unknown> = {}
  if (input.title != null) patch.title = input.title.trim()
  if (input.title_am !== undefined) patch.title_am = input.title_am
  if (input.date_label != null) patch.date_label = input.date_label.trim()
  if (input.time_label !== undefined) patch.time_label = input.time_label
  if (input.venue != null) patch.venue = input.venue.trim()
  if (input.category != null) patch.category = input.category
  if (input.description != null) patch.description = input.description.trim()
  if (input.price_label != null) patch.price_label = input.price_label
  if (input.featured !== undefined) patch.featured = input.featured
  if (input.status != null) patch.status = input.status
  if (input.sort_order !== undefined) patch.sort_order = input.sort_order
  const { error } = await supabase.from('city_events').update(patch).eq('id', id)
  return { error: error?.message ?? null }
}

export async function deleteEvent(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('city_events').delete().eq('id', id)
  return { error: error?.message ?? null }
}

/** Set primary cover image URL for a place (CMS media field) */
export async function setPlaceCoverImage(
  placeId: string,
  url: string | null
): Promise<{ error: string | null }> {
  if (!url?.trim()) {
    // clear primary flags
    const { error } = await supabase
      .from('place_images')
      .update({ is_primary: false })
      .eq('place_id', placeId)
    return { error: error?.message ?? null }
  }
  const clean = url.trim()
  // Upsert primary: try update existing primary, else insert
  const { data: existing } = await supabase
    .from('place_images')
    .select('id')
    .eq('place_id', placeId)
    .eq('is_primary', true)
    .maybeSingle()

  if (existing?.id) {
    const { error } = await supabase
      .from('place_images')
      .update({ url: clean, alt_text: 'Cover' })
      .eq('id', existing.id)
    return { error: error?.message ?? null }
  }

  await supabase.from('place_images').update({ is_primary: false }).eq('place_id', placeId)
  const { error } = await supabase.from('place_images').insert({
    place_id: placeId,
    url: clean,
    alt_text: 'Cover',
    is_primary: true,
    sort_order: 0,
  })
  return { error: error?.message ?? null }
}

export async function fetchPlaceCoverUrl(placeId: string): Promise<string | null> {
  const { data } = await supabase
    .from('place_images')
    .select('url')
    .eq('place_id', placeId)
    .eq('is_primary', true)
    .maybeSingle()
  return data?.url ?? null
}
