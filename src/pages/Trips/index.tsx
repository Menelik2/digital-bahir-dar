import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Calendar,
  Users,
  Wallet,
  Loader2,
  Trash2,
  MapPin,
  Compass,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useMyTrips, useCreateTrip, useDeleteTrip } from '@/hooks/useTrips'
import { BAHIR_DAR_ITINERARIES, type GuideItinerary } from '@/data/itineraries'
import type { Trip } from '@/types/trip'
import { cn } from '@/lib/utils'

function isDemoTrip(id: string) {
  return id.startsWith('demo-') || id.startsWith('guide-')
}

function TripCard({ trip, onDelete }: { trip: Trip; onDelete: (id: string) => void }) {
  return (
    <Card className="overflow-hidden border-[#078930]/10 transition hover:shadow-md">
      <Link to={`/trips/${trip.id}`}>
        <div className="h-2 bg-gradient-to-r from-[#078930] to-[#0b6e99]" />
        <CardContent className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">{trip.title}</h3>
          </div>
          {trip.description && (
            <p className="mb-3 line-clamp-2 text-sm text-slate-500">{trip.description.split('\n')[0]}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            {trip.start_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {trip.start_date}
                {trip.end_date && ` → ${trip.end_date}`}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {trip.traveler_count}
            </span>
            {trip.budget_total != null && (
              <span className="flex items-center gap-1">
                <Wallet className="h-3.5 w-3.5" />
                {Number(trip.budget_total).toLocaleString()} {trip.currency}
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 capitalize dark:bg-slate-800">
              {trip.status}
            </span>
          </div>
        </CardContent>
      </Link>
      {!isDemoTrip(trip.id) && (
        <div className="border-t border-slate-100 px-4 py-2 dark:border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600"
            onClick={(e) => {
              e.preventDefault()
              if (confirm('Delete this trip?')) onDelete(trip.id)
            }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      )}
    </Card>
  )
}

function GuideCard({ guide }: { guide: GuideItinerary }) {
  return (
    <Link to={`/trips/${guide.id}`} className="block h-full">
      <Card className="h-full overflow-hidden border-[#078930]/15 transition hover:border-[#078930]/40 hover:shadow-md dark:border-[#078930]/30">
        <div className="h-1.5 bg-gradient-to-r from-[#f5c518] via-[#078930] to-[#0b6e99]" />
        <CardContent className="flex h-full flex-col p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-snug text-slate-900 dark:text-white">{guide.title}</h3>
            <span className="shrink-0 rounded-full bg-[#078930]/10 px-2 py-0.5 text-[10px] font-semibold text-[#056b24] dark:text-[#7dcea0]">
              {guide.days}d
            </span>
          </div>
          <p className="mb-3 line-clamp-2 text-sm text-slate-500">{guide.subtitle}</p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {guide.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {t.replace('-', ' ')}
              </span>
            ))}
          </div>
          <ul className="mb-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            {guide.highlights.slice(0, 3).map((h) => (
              <li key={h} className="flex gap-1.5">
                <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-[#d4a017]" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {guide.pace}
            </span>
            <span className="flex items-center gap-1">
              <Wallet className="h-3 w-3" />~
              {guide.budgetPerPersonEtb.typical.toLocaleString()} ETB/person
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function TripsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { data: trips = [], isLoading } = useMyTrips()
  const createMut = useCreateTrip()
  const deleteMut = useDeleteTrip()
  const [showForm, setShowForm] = useState(true)
  const [title, setTitle] = useState('')
  const [budget, setBudget] = useState('')
  const [travelers, setTravelers] = useState('1')
  const [tagFilter, setTagFilter] = useState<string | null>(null)

  const personalTrips = trips.filter((t) => !isDemoTrip(t.id))

  const guides = tagFilter
    ? BAHIR_DAR_ITINERARIES.filter((g) => g.tags.includes(tagFilter as GuideItinerary['tags'][number]))
    : BAHIR_DAR_ITINERARIES

  const tagOptions = [
    { id: null, label: 'All plans' },
    { id: 'first-visit', label: 'First visit' },
    { id: 'weekend', label: 'Weekend' },
    { id: 'budget', label: 'Budget' },
    { id: 'nature', label: 'Nature' },
    { id: 'culture', label: 'Culture' },
    { id: 'slow', label: 'Slow' },
  ] as const

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      const trip = await createMut.mutateAsync({
        title: title.trim(),
        budget_total: budget ? Number(budget) : undefined,
        traveler_count: Math.max(1, parseInt(travelers, 10) || 1),
      })
      setShowForm(false)
      setTitle('')
      setBudget('')
      window.location.href = `/trips/${trip.id}`
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not create trip')
    }
  }

  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#078930]" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <div className="mb-5">
        <h1 className="text-2xl font-bold sm:text-3xl">My Trips</h1>
        <p className="text-sm text-slate-500 sm:text-base">Plan and save your Bahir Dar itinerary</p>
      </div>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="ethio-title text-lg font-semibold">New trip</h2>
          {isAuthenticated && !showForm && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Create
            </Button>
          )}
        </div>

        {!isAuthenticated && (
          <Card className="border-dashed border-[#078930]/30">
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <MapPin className="h-10 w-10 text-[#078930]/40" />
              <p className="max-w-md text-sm text-slate-500">
                Sign in to create and save private trips, track expenses, and manage budgets.
              </p>
              <Link to="/auth">
                <Button>
                  <Plus className="h-4 w-4" /> Log in to create a trip
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {isAuthenticated && showForm && (
          <form
            onSubmit={handleCreate}
            className="space-y-3 rounded-2xl border border-[#078930]/20 bg-white p-4 shadow-sm dark:border-[#078930]/30 dark:bg-slate-900"
          >
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Start a personal itinerary
            </p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Trip title (e.g. Weekend in Bahir Dar)"
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none focus:border-[#078930] dark:border-slate-700 dark:bg-slate-950"
              required
              autoFocus
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Budget (ETB)"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-3 text-base outline-none focus:border-[#078930] dark:border-slate-700 dark:bg-slate-950"
              />
              <input
                type="number"
                min={1}
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                placeholder="Travelers"
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none focus:border-[#078930] dark:border-slate-700 dark:bg-slate-950 sm:w-32"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" disabled={createMut.isPending} className="w-full sm:w-auto" size="lg">
                {createMut.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating…
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Create trip
                  </>
                )}
              </Button>
              {personalTrips.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full sm:w-auto"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}

        {isAuthenticated && !showForm && personalTrips.length === 0 && (
          <Button className="w-full sm:w-auto" size="lg" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Create your first trip
          </Button>
        )}
      </section>

      <section className="mb-10">
        <h2 className="ethio-title mb-3 text-lg font-semibold">Your saved trips</h2>

        {isAuthenticated && isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#078930]" />
          </div>
        )}

        {isAuthenticated && !isLoading && personalTrips.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <p className="text-sm text-slate-500">No saved trips yet. Create one above to get started.</p>
            </CardContent>
          </Card>
        )}

        {isAuthenticated && !isLoading && personalTrips.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {personalTrips.map((t) => (
              <TripCard key={t.id} trip={t} onDelete={(id) => deleteMut.mutate(id)} />
            ))}
          </div>
        )}

        {!isAuthenticated && (
          <p className="text-sm text-slate-500">Log in to see trips you have saved.</p>
        )}
      </section>

      <Link to="/trip-planner" className="mb-10 block">
        <Card className="overflow-hidden border-[#0b6e99]/25 transition hover:border-[#0b6e99]/50 hover:shadow-md dark:border-[#0b6e99]/40">
          <CardContent className="flex flex-wrap items-center gap-4 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b6e99] to-[#078930] text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">AI Trip Planner</p>
              <p className="text-sm text-slate-500">Build a day-by-day plan in about 30 seconds</p>
            </div>
            <span className="text-sm font-medium text-[#0b6e99]">Open →</span>
          </CardContent>
        </Card>
      </Link>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Compass className="h-5 w-5 text-[#078930]" />
          <h2 className="text-lg font-semibold">Ready-made Bahir Dar plans</h2>
        </div>
        <p className="mb-3 text-sm text-slate-500">
          Browse example day plans anytime. Create your own trip above to save and edit.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {tagOptions.map((t) => (
            <button
              key={String(t.id)}
              type="button"
              onClick={() => setTagFilter(t.id)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                tagFilter === t.id
                  ? 'border-[#078930] bg-[#078930] text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-[#078930]/40 dark:border-slate-700 dark:bg-slate-900'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {guides.map((g) => (
            <GuideCard key={g.id} guide={g} />
          ))}
        </div>
      </section>
    </div>
  )
}
