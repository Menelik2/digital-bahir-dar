import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { CITY_EVENTS, type CityEvent } from '@/data/cityLife'

export type DbCityEvent = CityEvent & {
  dbId?: string
  status?: string
}

function mapRow(row: Record<string, unknown>): DbCityEvent {
  return {
    id: (row.id as string) || String(row.title),
    dbId: row.id as string,
    title: row.title as string,
    titleAm: (row.title_am as string) || undefined,
    dateLabel: row.date_label as string,
    timeLabel: (row.time_label as string) || undefined,
    venue: row.venue as string,
    category: row.category as CityEvent['category'],
    description: row.description as string,
    priceLabel: (row.price_label as string) || 'Check locally',
    featured: !!row.featured,
    status: row.status as string,
  }
}

/** Prefer DB published events; fall back to curated CITY_EVENTS */
export async function fetchCityEvents(): Promise<DbCityEvent[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('city_events')
        .select('*')
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
        .order('featured', { ascending: false })

      if (!error && data && data.length > 0) {
        return data.map((r) => mapRow(r as Record<string, unknown>))
      }
    } catch (e) {
      console.warn('fetchCityEvents:', e)
    }
  }
  return CITY_EVENTS.map((e) => ({ ...e }))
}
