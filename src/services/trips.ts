import { supabase } from '@/lib/supabase'
import type { Trip, TripDay, TripStop, TripExpense, TripInput, BudgetBreakdown } from '@/types/trip'
import { sumTripSpending } from '@/utils/budget'

export async function fetchMyTrips(userId: string): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .neq('status', 'archived')
    .order('updated_at', { ascending: false })
  if (error) {
    console.warn('fetchMyTrips:', error.message)
    return []
  }
  return (data ?? []) as Trip[]
}

export async function fetchTrip(tripId: string): Promise<Trip | null> {
  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      days:trip_days(
        *,
        stops:trip_stops(*, place:places(id, name, slug, latitude, longitude))
      ),
      expenses:trip_expenses(*)
    `)
    .eq('id', tripId)
    .maybeSingle()
  if (error || !data) {
    if (error) console.warn('fetchTrip:', error.message)
    return null
  }
  const trip = data as Trip
  if (trip.days) {
    trip.days = [...trip.days].sort((a, b) => a.day_number - b.day_number)
    for (const day of trip.days) {
      if (day.stops) {
        day.stops = [...day.stops]
          .map((s) => ({
            ...s,
            place: Array.isArray(s.place) ? s.place[0] : s.place,
          }))
          .sort((a, b) => a.sort_order - b.sort_order)
      }
    }
  }
  return trip
}

export async function createTrip(
  userId: string,
  input: TripInput
): Promise<{ trip: Trip | null; error: string | null }> {
  const title = (input.title ?? '').trim()
  if (title.length < 2) return { trip: null, error: 'Title must be at least 2 characters' }
  if (title.length > 80) return { trip: null, error: 'Title must be at most 80 characters' }
  const travelers = input.traveler_count ?? 1
  if (!Number.isFinite(travelers) || travelers < 1 || travelers > 50) {
    return { trip: null, error: 'Travelers must be between 1 and 50' }
  }
  if (input.budget_total != null && (input.budget_total < 0 || input.budget_total > 50_000_000)) {
    return { trip: null, error: 'Budget is out of range' }
  }
  if (input.start_date && input.end_date && input.end_date < input.start_date) {
    return { trip: null, error: 'End date must be on or after start date' }
  }

  const { data, error } = await supabase
    .from('trips')
    .insert({
      user_id: userId,
      title,
      description: input.description || null,
      start_date: input.start_date || null,
      end_date: input.end_date || null,
      traveler_count: travelers,
      budget_total: input.budget_total ?? null,
      currency: input.currency ?? 'ETB',
      status: input.status ?? 'planning',
    })
    .select()
    .single()
  if (error) return { trip: null, error: error.message }
  return { trip: data as Trip, error: null }
}

export async function updateTrip(tripId: string, input: Partial<TripInput>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('trips').update(input).eq('id', tripId)
  return { error: error?.message ?? null }
}

export async function deleteTrip(tripId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('trips').delete().eq('id', tripId)
  return { error: error?.message ?? null }
}

export async function addTripDay(
  tripId: string,
  dayNumber: number,
  opts?: { date?: string; title?: string }
): Promise<{ day: TripDay | null; error: string | null }> {
  const { data, error } = await supabase
    .from('trip_days')
    .insert({
      trip_id: tripId,
      day_number: dayNumber,
      date: opts?.date || null,
      title: opts?.title || `Day ${dayNumber}`,
    })
    .select()
    .single()
  if (error) return { day: null, error: error.message }
  return { day: data as TripDay, error: null }
}

export async function addTripStop(
  tripDayId: string,
  stop: {
    place_id?: string
    custom_name?: string
    sort_order?: number
    notes?: string
    estimated_cost?: number
  }
): Promise<{ stop: TripStop | null; error: string | null }> {
  const { data, error } = await supabase
    .from('trip_stops')
    .insert({
      trip_day_id: tripDayId,
      place_id: stop.place_id || null,
      custom_name: stop.custom_name || null,
      sort_order: stop.sort_order ?? 0,
      notes: stop.notes || null,
      estimated_cost: stop.estimated_cost ?? null,
    })
    .select()
    .single()
  if (error) return { stop: null, error: error.message }
  return { stop: data as TripStop, error: null }
}

export async function deleteTripStop(stopId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('trip_stops').delete().eq('id', stopId)
  return { error: error?.message ?? null }
}

export async function addExpense(
  tripId: string,
  expense: {
    category: string
    title: string
    amount: number
    currency?: string
    expense_date?: string
    notes?: string
    is_estimated?: boolean
  }
): Promise<{ expense: TripExpense | null; error: string | null }> {
  const { data, error } = await supabase
    .from('trip_expenses')
    .insert({
      trip_id: tripId,
      category: expense.category,
      title: expense.title,
      amount: expense.amount,
      currency: expense.currency ?? 'ETB',
      expense_date: expense.expense_date || null,
      notes: expense.notes || null,
      is_estimated: expense.is_estimated ?? true,
    })
    .select()
    .single()
  if (error) return { expense: null, error: error.message }
  return { expense: data as TripExpense, error: null }
}

export async function deleteExpense(expenseId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('trip_expenses').delete().eq('id', expenseId)
  return { error: error?.message ?? null }
}

export function computeBudget(trip: Trip): BudgetBreakdown {
  return sumTripSpending(trip)
}

export function createDemoTrip(userId: string): Trip {
  const now = new Date().toISOString()
  return {
    id: 'demo-trip',
    user_id: userId,
    title: 'Bahir Dar weekend',
    description: 'Sample itinerary',
    start_date: null,
    end_date: null,
    traveler_count: 2,
    budget_total: 15000,
    currency: 'ETB',
    status: 'planning',
    is_public: false,
    created_at: now,
    updated_at: now,
    days: [],
    expenses: [],
  }
}

// ── Admin / staff trip management ──────────────────────────────────────────

export type AdminTripRow = Trip & {
  profile?: { full_name?: string | null; email?: string | null } | null
}

/** List all trips for staff moderation (newest first). */
export async function fetchAdminTrips(limit = 100): Promise<AdminTripRow[]> {
  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      profile:profiles!trips_user_id_fkey(full_name, email)
    `)
    .order('updated_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.warn('fetchAdminTrips join failed, retrying plain:', error.message)
    const { data: plain, error: e2 } = await supabase
      .from('trips')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit)
    if (e2) {
      console.warn('fetchAdminTrips:', e2.message)
      return []
    }
    return (plain ?? []) as AdminTripRow[]
  }
  return (data ?? []).map((row) => ({
    ...row,
    profile: Array.isArray(row.profile) ? row.profile[0] : row.profile,
  })) as AdminTripRow[]
}

export async function adminUpdateTrip(
  tripId: string,
  input: Partial<TripInput> & { is_public?: boolean }
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('trips').update(input).eq('id', tripId)
  return { error: error?.message ?? null }
}

export async function adminDeleteTrip(tripId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('trips').delete().eq('id', tripId)
  return { error: error?.message ?? null }
}

export async function adminSetTripStatus(
  tripId: string,
  status: import('@/types/trip').TripStatus
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('trips').update({ status }).eq('id', tripId)
  return { error: error?.message ?? null }
}

export async function adminCreateTrip(
  userId: string,
  input: TripInput & { is_public?: boolean }
): Promise<{ trip: Trip | null; error: string | null }> {
  const base = await createTrip(userId, input)
  if (base.error || !base.trip) return base
  if (input.is_public != null) {
    await supabase.from('trips').update({ is_public: !!input.is_public }).eq('id', base.trip.id)
    base.trip.is_public = !!input.is_public
  }
  return base
}

export async function adminUpdateTripDay(
  dayId: string,
  patch: { title?: string | null; notes?: string | null; date?: string | null; day_number?: number }
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('trip_days').update(patch).eq('id', dayId)
  return { error: error?.message ?? null }
}

export async function adminDeleteTripDay(dayId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('trip_days').delete().eq('id', dayId)
  return { error: error?.message ?? null }
}
