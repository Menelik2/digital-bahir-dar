import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, Users, Wallet, Loader2, Trash2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useMyTrips, useCreateTrip, useDeleteTrip } from '@/hooks/useTrips'
import type { Trip } from '@/types/trip'

function TripCard({ trip, onDelete }: { trip: Trip; onDelete: (id: string) => void }) {
  const isDemo = trip.id.startsWith('demo-')
  return (
    <Card className="overflow-hidden transition hover:shadow-md">
      <Link to={`/trips/${trip.id}`}>
        <div className="h-2 bg-gradient-to-r from-sky-500 to-teal-500" />
        <CardContent className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">{trip.title}</h3>
            {isDemo && (
              <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">DEMO</span>
            )}
          </div>
          {trip.description && (
            <p className="mb-3 line-clamp-2 text-sm text-slate-500">{trip.description}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            {trip.start_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {trip.start_date}{trip.end_date && ` → ${trip.end_date}`}
              </span>
            )}
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {trip.traveler_count}</span>
            {trip.budget_total != null && (
              <span className="flex items-center gap-1">
                <Wallet className="h-3.5 w-3.5" />
                {Number(trip.budget_total).toLocaleString()} {trip.currency}
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 capitalize dark:bg-slate-800">{trip.status}</span>
          </div>
        </CardContent>
      </Link>
      {!isDemo && (
        <div className="border-t border-slate-100 px-4 py-2 dark:border-slate-800">
          <Button variant="ghost" size="sm" className="text-red-600"
            onClick={(e) => { e.preventDefault(); if (confirm('Delete this trip?')) onDelete(trip.id) }}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      )}
    </Card>
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

  if (authLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <MapPin className="mx-auto mb-4 h-12 w-12 text-slate-300" />
        <h1 className="mb-2 text-2xl font-bold">Plan your Bahir Dar trip</h1>
        <p className="mb-6 text-slate-500">Sign in to create itineraries, track expenses, and manage your budget.</p>
        <Link to="/auth"><Button size="lg">Log in</Button></Link>
      </div>
    )
  }

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My Trips</h1>
          <p className="text-slate-500">Itineraries and plans for Bahir Dar</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" /> New trip</Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Trip title (e.g. Weekend in Bahir Dar)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950" required />
          <div className="flex gap-3">
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget (ETB)"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950" />
            <input type="number" min={1} value={travelers} onChange={(e) => setTravelers(e.target.value)} placeholder="Travelers"
              className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={createMut.isPending}>{createMut.isPending ? 'Creating…' : 'Create trip'}</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {isLoading && <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>}

      {!isLoading && trips.length === 0 && (
        <Card><CardContent className="py-12 text-center">
          <p className="mb-4 text-slate-500">No trips yet. Create your first itinerary.</p>
          <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> New trip</Button>
        </CardContent></Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {trips.map((t) => (
          <TripCard key={t.id} trip={t} onDelete={(id) => deleteMut.mutate(id)} />
        ))}
      </div>
    </div>
  )
}
