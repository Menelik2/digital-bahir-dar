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
import { parseTripCreate, type FieldErrors } from '@/lib/tripValidation'
import { useT } from '@/hooks/useT'
import { useAppStore } from '@/store'
import { usePlaceholders } from '@/i18n/formPlaceholders'

function isDemoTrip(id: string) {
  return id.startsWith('demo-') || id.startsWith('guide-')
}

function TripCard({ trip, onDelete }: { trip: Trip; onDelete: (id: string) => void }) {
  const t = useT()
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
              if (confirm(t.common.delete + '?')) onDelete(trip.id)
            }}
          >
            <Trash2 className="h-3.5 w-3.5" /> {t.common.delete}
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
            {guide.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {tag.replace('-', ' ')}
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
  const t = useT()
  const language = useAppStore((s) => s.language)
  const placeholders = usePlaceholders(language)
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { data: trips = [], isLoading } = useMyTrips()
  const createMut = useCreateTrip()
  const deleteMut = useDeleteTrip()
  const [showForm, setShowForm] = useState(true)
  const [title, setTitle] = useState('')
  const [budget, setBudget] = useState('')
  const [travelers, setTravelers] = useState('1')
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<FieldErrors>({})
  const [formMessage, setFormMessage] = useState<string | null>(null)

  const personalTrips = trips.filter((tr) => !isDemoTrip(tr.id))

  const guides = tagFilter
    ? BAHIR_DAR_ITINERARIES.filter((g) => g.tags.includes(tagFilter as GuideItinerary['tags'][number]))
    : BAHIR_DAR_ITINERARIES

  const tagOptions = [
    { id: null as string | null, label: t.common.all },
    { id: 'first-visit', label: language === 'am' ? 'መጀመሪያ ጉብኝት' : 'First visit' },
    { id: 'weekend', label: language === 'am' ? 'ሳምንት መጨረሻ' : 'Weekend' },
    { id: 'budget', label: t.list.budget },
    { id: 'nature', label: t.planner.nature },
    { id: 'culture', label: t.planner.culture },
    { id: 'slow', label: language === 'am' ? 'ዝግ' : 'Slow' },
  ]

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormMessage(null)
    const parsed = parseTripCreate({ title, budget, travelers })
    if (!parsed.ok) {
      setFormErrors(parsed.errors)
      setFormMessage(parsed.message)
      return
    }
    setFormErrors({})
    try {
      const trip = await createMut.mutateAsync(parsed.data)
      setShowForm(false)
      setTitle('')
      setBudget('')
      setTravelers('1')
      setFormMessage(null)
      window.location.href = `/trips/${trip.id}`
    } catch (err) {
      setFormMessage(err instanceof Error ? err.message : t.common.error)
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
    <div className="mx-auto max-w-4xl px-4 py-5 pb-nav-safe sm:py-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-3xl">
          {t.trips.title}
        </h1>
        <p className="mt-0.5 text-[14px] text-[#8e8e93] sm:text-[15px]">{t.trips.subtitle}</p>
      </div>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="ethio-title text-lg font-semibold">{t.trips.newTrip}</h2>
          {isAuthenticated && !showForm && (
            <Button size="sm" className="min-h-[40px] rounded-full" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> {t.common.create}
            </Button>
          )}
        </div>

        {!isAuthenticated && (
          <Card className="border-dashed border-[#078930]/30">
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <MapPin className="h-10 w-10 text-[#078930]/40" />
              <p className="max-w-md text-sm text-slate-500">{t.trips.loginBody}</p>
              <Link to="/auth">
                <Button className="min-h-[48px] rounded-full px-6">
                  <Plus className="h-4 w-4" /> {t.trips.loginToSave}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {isAuthenticated && showForm && (
          <form
            onSubmit={handleCreate}
            className="space-y-3 rounded-2xl border border-[#078930]/20 bg-white p-4 shadow-sm dark:border-[#078930]/30 dark:bg-slate-900"
            noValidate
          >
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.trips.newTrip}</p>
            {formMessage && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">
                {formMessage}
              </p>
            )}
            <div>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (formErrors.title) setFormErrors((prev) => ({ ...prev, title: undefined }))
                }}
                placeholder={placeholders.tripTitle}
                className={cn(
                  'w-full rounded-xl border px-3 py-3 text-base outline-none focus:border-[#078930] dark:bg-slate-950',
                  formErrors.title ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
                )}
                aria-invalid={!!formErrors.title}
                autoFocus
              />
              {formErrors.title && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.title}</p>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="1"
                  value={budget}
                  onChange={(e) => {
                    setBudget(e.target.value)
                    if (formErrors.budget_total) setFormErrors((prev) => ({ ...prev, budget_total: undefined }))
                  }}
                  placeholder={placeholders.tripBudget}
                  className={cn(
                    'w-full rounded-xl border px-3 py-3 text-base outline-none focus:border-[#078930] dark:bg-slate-950',
                    formErrors.budget_total ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
                  )}
                  aria-invalid={!!formErrors.budget_total}
                />
                {formErrors.budget_total && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.budget_total}</p>
                )}
              </div>
              <div className="w-full sm:w-32">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={50}
                  value={travelers}
                  onChange={(e) => {
                    setTravelers(e.target.value)
                    if (formErrors.traveler_count) setFormErrors((prev) => ({ ...prev, traveler_count: undefined }))
                  }}
                  placeholder={placeholders.tripTravelers}
                  className={cn(
                    'w-full rounded-xl border px-3 py-3 text-base outline-none focus:border-[#078930] dark:bg-slate-950',
                    formErrors.traveler_count ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
                  )}
                  aria-invalid={!!formErrors.traveler_count}
                />
                {formErrors.traveler_count && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.traveler_count}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" disabled={createMut.isPending} className="min-h-[48px] w-full rounded-full sm:w-auto" size="lg">
                {createMut.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {t.common.loading}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> {t.trips.newTrip}
                  </>
                )}
              </Button>
              {personalTrips.length > 0 && (
                <Button type="button" variant="ghost" className="w-full sm:w-auto" onClick={() => setShowForm(false)}>
                  {t.common.cancel}
                </Button>
              )}
            </div>
          </form>
        )}

        {isAuthenticated && !showForm && personalTrips.length === 0 && (
          <Button className="min-h-[48px] w-full rounded-full sm:w-auto" size="lg" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> {t.trips.newTrip}
          </Button>
        )}
      </section>

      <section className="mb-10">
        <h2 className="ethio-title mb-3 text-lg font-semibold">{t.trips.yourTrips}</h2>

        {isAuthenticated && isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#078930]" />
          </div>
        )}

        {isAuthenticated && !isLoading && personalTrips.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <p className="text-sm text-slate-500">{t.trips.noTrips}</p>
            </CardContent>
          </Card>
        )}

        {isAuthenticated && !isLoading && personalTrips.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {personalTrips.map((tr) => (
              <TripCard key={tr.id} trip={tr} onDelete={(id) => deleteMut.mutate(id)} />
            ))}
          </div>
        )}

        {!isAuthenticated && <p className="text-sm text-slate-500">{t.trips.loginToSave}</p>}
      </section>

      <Link to="/trip-planner" className="mb-10 block">
        <Card className="overflow-hidden border-[#0b6e99]/25 transition hover:border-[#0b6e99]/50 hover:shadow-md dark:border-[#0b6e99]/40">
          <CardContent className="flex flex-wrap items-center gap-4 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b6e99] to-[#078930] text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">{t.trips.plannerCta}</p>
              <p className="text-sm text-slate-500">{t.trips.plannerCtaBody}</p>
            </div>
            <span className="text-sm font-medium text-[#0b6e99]">{t.trips.openPlanner}</span>
          </CardContent>
        </Card>
      </Link>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Compass className="h-5 w-5 text-[#078930]" />
          <h2 className="text-lg font-semibold">{t.trips.readyMade}</h2>
        </div>
        <p className="mb-3 text-sm text-slate-500">{t.trips.readyMadeBody}</p>
        <div className="mobile-chips mb-4 gap-2">
          {tagOptions.map((opt) => (
            <button
              key={String(opt.id)}
              type="button"
              onClick={() => setTagFilter(opt.id)}
              className={cn(
                'min-h-[36px] shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition active:scale-[0.97]',
                tagFilter === opt.id
                  ? 'border-[#078930] bg-[#078930] text-white shadow-sm shadow-[#078930]/25'
                  : 'border-black/[0.08] bg-white text-[#1c1c1e] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-white'
              )}
            >
              {opt.label}
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
