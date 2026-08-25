import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Place } from '@/types/place'
import { searchPlaces as localSearch, getCuratedPlaces } from './places'

function normalizePlace(row: Record<string, unknown>): Place {
  const one = <T>(v: T | T[] | null | undefined): T | null =>
    Array.isArray(v) ? v[0] ?? null : v ?? null
  return {
    ...(row as unknown as Place),
    category: one(row.category as Place['category']) as Place['category'],
  }
}

/** Server-side place search via Postgres RPC; falls back to client filter on curated data */
export async function serverSearchPlaces(query: string, limit = 12): Promise<Place[]> {
  const q = query.trim()
  if (!q) return []

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.rpc('search_places', { q, lim: limit })
      if (!error && data && Array.isArray(data) && data.length > 0) {
        // Attach categories in a second light query when possible
        const ids = (data as Place[]).map((p) => p.id)
        const { data: full } = await supabase
          .from('places')
          .select('*, category:categories(*)')
          .in('id', ids)
          .eq('status', 'published')
          .is('deleted_at', null)

        if (full?.length) {
          const byId = new Map(full.map((r) => [r.id, normalizePlace(r as Record<string, unknown>)]))
          return (data as Place[]).map((p) => byId.get(p.id) ?? p).filter(Boolean).slice(0, limit)
        }
        return (data as Place[]).slice(0, limit)
      }

      // Fallback: direct ilike if RPC missing
      const { data: rows, error: e2 } = await supabase
        .from('places')
        .select('*, category:categories(*)')
        .eq('status', 'published')
        .is('deleted_at', null)
        .or(`name.ilike.%${q}%,address.ilike.%${q}%,short_description.ilike.%${q}%,slug.ilike.%${q}%`)
        .order('featured', { ascending: false })
        .limit(limit)

      if (!e2 && rows?.length) {
        return rows.map((r) => normalizePlace(r as Record<string, unknown>))
      }
    } catch (e) {
      console.warn('serverSearchPlaces:', e)
    }
  }

  return localSearch(getCuratedPlaces(), q).slice(0, limit)
}

/** Featured / verified recommendations from DB */
export async function fetchRecommendedPlaces(limit = 12): Promise<Place[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.rpc('recommend_places', { lim: limit })
      if (!error && data && Array.isArray(data) && data.length > 0) {
        const ids = (data as Place[]).map((p) => p.id)
        const { data: full } = await supabase
          .from('places')
          .select('*, category:categories(*)')
          .in('id', ids)
        if (full?.length) {
          const byId = new Map(full.map((r) => [r.id, normalizePlace(r as Record<string, unknown>)]))
          return (data as Place[]).map((p) => byId.get(p.id) ?? p).filter(Boolean)
        }
        return data as Place[]
      }

      const { data: rows } = await supabase
        .from('places')
        .select('*, category:categories(*)')
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('featured', { ascending: false })
        .order('verified', { ascending: false })
        .limit(limit)
      if (rows?.length) return rows.map((r) => normalizePlace(r as Record<string, unknown>))
    } catch (e) {
      console.warn('fetchRecommendedPlaces:', e)
    }
  }
  return getCuratedPlaces().filter((p) => p.featured).slice(0, limit)
}
