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

export async function createTrip(userId: string, input: TripInput): Promise<{ trip: Trip | null; error: string | null }> {
  const { data, error } = await supabase
    .from('trips')
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description || null,
      start_date: input.start_date || null,
      end_date: input.end_date || null,
      traveler_count: input.traveler_count ?? 1,
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

/** Trip spending: logged expenses + stop estimates (see utils/budget). */
export function computeBudget(trip: Trip): BudgetBreakdown {
  return sumTripSpending(trip)
}

export function createDemoTrip(userId: string): Trip {
  const id = 'demo-trip-1'
  return {
    id,
    user_id: userId,
    title: 'Bahir Dar Weekend (DEMO)',
    description: 'DEMO itinerary — create your own trip to save to Supabase.',
    start_date: null,
    end_date: null,
    traveler_count: 2,
    budget_total: 15000,
    currency: 'ETB',
    status: 'planning',
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    days: [
      {
        id: 'demo-day-1',
        trip_id: id,
        day_number: 1,
        date: null,
        title: 'Lake & city',
        notes: null,
        created_at: new Date().toISOString(),
        stops: [
          {
            id: 'demo-stop-1',
            trip_day_id: 'demo-day-1',
            place_id: null,
            custom_name: 'Lake Tana boat trip (DEMO)',
            sort_order: 0,
            start_time: '09:00',
            end_time: '13:00',
            notes: 'Book verified operator',
            estimated_cost: 2000,
            created_at: new Date().toISOString(),
          },
          {
            id: 'demo-stop-2',
            trip_day_id: 'demo-day-1',
            place_id: null,
            custom_name: 'Lakeside dinner (DEMO)',
            sort_order: 1,
            start_time: '19:00',
            end_time: null,
            notes: null,
            estimated_cost: 800,
            created_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: 'demo-day-2',
        trip_id: id,
        day_number: 2,
        date: null,
        title: 'Blue Nile Falls',
        notes: null,
        created_at: new Date().toISOString(),
        stops: [
          {
            id: 'demo-stop-3',
            trip_day_id: 'demo-day-2',
            place_id: null,
            custom_name: 'Blue Nile Falls (DEMO)',
            sort_order: 0,
            start_time: '08:00',
            end_time: '14:00',
            notes: 'Confirm road conditions',
            estimated_cost: 1500,
            created_at: new Date().toISOString(),
          },
        ],
      },
    ],
    expenses: [
      {
        id: 'demo-exp-1',
        trip_id: id,
        category: 'lodging',
        title: 'Hotel (2 nights, DEMO)',
        amount: 6000,
        currency: 'ETB',
        expense_date: null,
        notes: 'Estimate only',
        is_estimated: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'demo-exp-2',
        trip_id: id,
        category: 'transport',
        title: 'Local transport (DEMO)',
        amount: 1500,
        currency: 'ETB',
        expense_date: null,
        notes: null,
        is_estimated: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  }
}
