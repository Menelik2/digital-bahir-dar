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

function TripCard({ trip, onDelete }: { trip: Trip; onDelete: (id: string) => void }) {
  const isDemo = trip.id.startsWith('demo-') || trip.id.startsWith('guide-')
  return (
    <Card className="overflow-hidden transition hover:shadow-md">
      <Link to={`/trips/${trip.id}`}>
        <div className="h-2 bg-gradient-to-r from-sky-500 to-teal-500" />
        <CardContent className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">{trip.title}</h3>
            {isDemo && (
              <span className="shrink-0 rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-200">
                GUIDE
              </span>
            )}
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
      {!trip.id.startsWith('demo-') && !trip.id.startsWith('guide-') && (
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
      <Card className="h-full overflow-hidden border-sky-100 transition hover:border-sky-300 hover:shadow-md dark:border-sky-900">
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-sky-500 to-teal-500" />
        <CardContent className="flex h-full flex-col p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-snug text-slate-900 dark:text-white">{guide.title}</h3>
            <span className="shrink-0 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-200">
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
                <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
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
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [budget, setBudget] = useState('')
  const [travelers, setTravelers] = useState('1')
  const [tagFilter, setTagFilter] = useState<string | null>(null)

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
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My Trips</h1>
          <p className="text-slate-500">Itineraries and plans for Bahir Dar — real places, practical pacing</p>
        </div>
        <Link to="/trip-planner">
          <Button className="bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700">
            <Sparkles className="h-4 w-4" /> AI Trip Planner
          </Button>
        </Link>
      </div>

      <Link to="/trip-planner" className="mb-8 block">
        <Card className="overflow-hidden border-sky-200 transition hover:border-sky-400 hover:shadow-md dark:border-sky-800">
          <CardContent className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">Build a custom plan in 30 seconds</p>
              <p className="text-sm text-slate-500">
                Pick days, budget, and interests — get a clear day-by-day Bahir Dar itinerary with ETB estimates.
              </p>
            </div>
            <span className="text-sm font-medium text-sky-600">Open planner →</span>
          </CardContent>
        </Card>
      </Link>

      {/* Ready-made guide plans — available without login */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Compass className="h-5 w-5 text-sky-600" />
          <h2 className="text-lg font-semibold">Ready-made Bahir Dar plans</h2>
        </div>
        <p className="mb-4 text-sm text-slate-500">
          Hand-built day plans using Lake Tana, monasteries, Blue Nile Falls, markets, and viewpoints.
          Budgets are planning estimates in ETB — confirm prices on site.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {tagOptions.map((t) => (
            <button
              key={String(t.id)}
              type="button"
              onClick={() => setTagFilter(t.id)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition',
                tagFilter === t.id
                  ? 'border-sky-600 bg-sky-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map((g) => (
            <GuideCard key={g.id} guide={g} />
          ))}
        </div>
      </section>

      {/* Personal trips */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Your saved trips</h2>
          {isAuthenticated ? (
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4" /> New trip
            </Button>
          ) : (
            <Link to="/auth">
              <Button size="sm" variant="outline">
                Log in to save trips
              </Button>
            </Link>
          )}
        </div>

        {!isAuthenticated && (
          <Card className="mb-6 border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <MapPin className="h-10 w-10 text-slate-300" />
              <p className="max-w-md text-sm text-slate-500">
                Browse the guide plans above freely. Sign in to create private itineraries, track expenses, and
                manage budgets.
              </p>
              <Link to="/auth">
                <Button>Log in</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {isAuthenticated && showForm && (
          <form
            onSubmit={handleCreate}
            className="mb-6 space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Trip title (e.g. Weekend in Bahir Dar)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
              required
            />
            <div className="flex gap-3">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Budget (ETB)"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
              />
              <input
                type="number"
                min={1}
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                placeholder="Travelers"
                className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createMut.isPending}>
                {createMut.isPending ? 'Creating…' : 'Create trip'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {isAuthenticated && isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
          </div>
        )}

        {isAuthenticated && !isLoading && trips.filter((t) => !t.id.startsWith('guide-')).length === 0 && (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="mb-4 text-slate-500">No personal trips yet. Create one or open a guide plan above.</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" /> New trip
              </Button>
            </CardContent>
          </Card>
        )}

        {isAuthenticated && (
          <div className="grid gap-4 sm:grid-cols-2">
            {trips
              .filter((t) => !t.id.startsWith('guide-'))
              .map((t) => (
                <TripCard key={t.id} trip={t} onDelete={(id) => deleteMut.mutate(id)} />
              ))}
          </div>
        )}
      </section>
    </div>
  )
}
