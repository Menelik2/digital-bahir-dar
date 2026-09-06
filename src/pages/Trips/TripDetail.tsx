import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Wallet,
  MapPin,
  Clock,
  Receipt,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  useTrip,
  useAddDay,
  useAddStop,
  useDeleteStop,
  useAddExpense,
  useDeleteExpense,
} from '@/hooks/useTrips'
import { computeBudget } from '@/services/trips'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { ExpenseList } from '@/components/expenses/ExpenseList'
import { formatMoney } from '@/utils/budget'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/useT'
import { usePlaceholders } from '@/i18n/formPlaceholders'
import { useAppStore } from '@/store'

export default function TripDetailPage() {
  const t = useT()
  const language = useAppStore((s) => s.language)
  const placeholders = usePlaceholders(language)
  const { tripId } = useParams<{ tripId: string }>()
  const { data: trip, isLoading, error } = useTrip(tripId)
  const isDemo = !!tripId && (tripId.startsWith('demo-') || tripId.startsWith('guide-'))

  const addDay = useAddDay(tripId!)
  const addStop = useAddStop(tripId!)
  const delStop = useDeleteStop(tripId!)
  const addExp = useAddExpense(tripId!)
  const delExp = useDeleteExpense(tripId!)

  const [stopName, setStopName] = useState('')
  const [stopDayId, setStopDayId] = useState<string | null>(null)
  const [showExpForm, setShowExpForm] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
        <h1 className="mb-2 text-xl font-semibold">{t.trips.notFound}</h1>
        <Link to="/trips">
          <Button variant="outline">{t.trips.backToTrips}</Button>
        </Link>
      </div>
    )
  }

  const budget = computeBudget(trip)
  const nextDayNum = (trip.days?.length ?? 0) + 1
  const usedPct = budget.usedPercent ?? null
  const logged = budget.loggedExpenses ?? 0
  const stops = budget.stopEstimates ?? 0

  const statusLabel = (() => {
    const s = String(trip.status || '').toLowerCase()
    if (s === 'planning') return t.trips.statusPlanning
    if (s === 'active') return t.trips.statusActive
    if (s === 'completed') return t.trips.statusCompleted
    return trip.status
  })()

  const travelerWord =
    trip.traveler_count === 1 ? t.trips.traveler : t.trips.travelers

  const handleAddStop = async (dayId: string) => {
    if (!stopName.trim() || isDemo) return
    try {
      await addStop.mutateAsync({ tripDayId: dayId, custom_name: stopName.trim() })
      setStopName('')
      setStopDayId(null)
    } catch (e) {
      alert(e instanceof Error ? e.message : t.trips.failed)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-nav-safe">
      <div className="mb-6 flex items-start gap-3">
        <Link to="/trips">
          <Button variant="ghost" size="icon" className="mt-1 shrink-0" aria-label={t.trips.backToTrips}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{trip.title}</h1>
            {isDemo && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                {t.trips.readyMade}
              </span>
            )}
          </div>
          {trip.description && <p className="mt-1 text-sm text-slate-500">{trip.description}</p>}
          <p className="mt-1 text-xs text-slate-400">
            {statusLabel} · {trip.traveler_count} {travelerWord}
          </p>
        </div>
      </div>

      {isDemo && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
          {t.trips.demoReadonly}{' '}
          <Link to="/expenses" className="font-medium underline">
            {t.trips.fullExpenses}
          </Link>
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-semibold">
              <Wallet className="h-5 w-5 text-sky-600" /> {t.trips.budgetSpending}
            </h2>
            <div className="flex gap-3 text-sm">
              <Link to="/expenses" className="text-sky-600 hover:underline">
                {t.trips.fullExpenses}
              </Link>
              <Link to="/budget" className="text-sky-600 hover:underline">
                {t.trips.budgetTools}
              </Link>
            </div>
          </div>

          {usedPct != null && (
            <div className="mb-3">
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>{t.trips.usedOfBudget}</span>
                <span>{usedPct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={cn(
                    'h-full rounded-full',
                    usedPct > 100 ? 'bg-red-500' : usedPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                  )}
                  style={{ width: `${Math.min(100, usedPct)}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-xs text-slate-400">{t.trips.budget}</p>
              <p className="font-semibold">
                {budget.budgetTotal != null
                  ? formatMoney(budget.budgetTotal, budget.currency)
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">{t.trips.projectedTotal}</p>
              <p className="font-semibold">
                {formatMoney(budget.totalExpenses, budget.currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">{t.trips.remaining}</p>
              <p
                className={cn(
                  'font-semibold',
                  budget.remaining != null && budget.remaining < 0 && 'text-red-600'
                )}
              >
                {budget.remaining != null
                  ? formatMoney(budget.remaining, budget.currency)
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">{t.trips.perPerson}</p>
              <p className="font-semibold">
                {formatMoney(Math.round(budget.perPerson ?? 0), budget.currency)}
              </p>
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            {t.trips.logged}: {formatMoney(logged, budget.currency)}
            {' · '}
            {t.trips.actual}: {formatMoney(budget.actualOnly ?? 0, budget.currency)}
            {' · '}
            {t.trips.estimated}: {formatMoney(budget.estimatedOnly ?? 0, budget.currency)}
            {stops > 0 && (
              <>
                {' · '}
                {t.trips.stopsLabel}: {formatMoney(stops, budget.currency)}
              </>
            )}
          </p>

          {Object.keys(budget.byCategory).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(budget.byCategory).map(([cat, amt]) => (
                <span
                  key={cat}
                  className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs capitalize dark:bg-slate-800"
                >
                  {cat}: {Number(amt).toLocaleString()}
                </span>
              ))}
              {stops > 0 && (
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  {t.trips.stopsLabel}: {stops.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{t.trips.itinerary}</h2>
          {!isDemo && (
            <Button
              size="sm"
              variant="outline"
              className="min-h-[40px] rounded-full"
              disabled={addDay.isPending}
              onClick={() => addDay.mutate(nextDayNum)}
            >
              <Plus className="h-4 w-4" /> {t.trips.addDay} {nextDayNum}
            </Button>
          )}
        </div>

        {(!trip.days || trip.days.length === 0) && (
          <p className="text-sm text-slate-500">{t.trips.noDays}</p>
        )}

        <div className="space-y-4">
          {(trip.days ?? []).map((day) => (
            <Card key={day.id}>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#078930]" />
                  <h3 className="font-semibold">
                    {t.trips.addDay} {day.day_number}
                    {day.title ? ` — ${day.title}` : ''}
                  </h3>
                </div>

                <ul className="mb-3 space-y-2">
                  {(day.stops ?? []).map((stop) => (
                    <li
                      key={stop.id}
                      className="flex items-start justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">
                          {stop.custom_name || stop.place?.name || t.trips.stopFallback}
                        </p>
                        {stop.start_time && (
                          <p className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3" /> {stop.start_time}
                          </p>
                        )}
                      </div>
                      {!isDemo && (
                        <button
                          type="button"
                          className="text-slate-400 hover:text-red-500"
                          onClick={() => delStop.mutate(stop.id)}
                          aria-label={t.common.delete}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                {!isDemo && (
                  <div>
                    {stopDayId === day.id ? (
                      <div className="flex flex-wrap gap-2">
                        <input
                          value={stopName}
                          onChange={(e) => setStopName(e.target.value)}
                          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                          placeholder={placeholders.stopName}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddStop(day.id)}
                        />
                        <Button size="sm" onClick={() => handleAddStop(day.id)}>
                          {t.common.save}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setStopDayId(null)}>
                          {t.common.cancel}
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => setStopDayId(day.id)}>
                        <Plus className="h-3.5 w-3.5" /> {t.trips.new}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Receipt className="h-5 w-5 text-sky-600" /> {t.trips.expenses}
          </h2>
          {!isDemo && (
            <Button size="sm" variant="outline" className="min-h-[40px] rounded-full" onClick={() => setShowExpForm(!showExpForm)}>
              <Plus className="h-4 w-4" /> {t.trips.addExpense}
            </Button>
          )}
        </div>

        {showExpForm && !isDemo && (
          <div className="mb-4">
            <ExpenseForm
              currency={trip.currency}
              pending={addExp.isPending}
              onCancel={() => setShowExpForm(false)}
              onSubmit={async (v) => {
                await addExp.mutateAsync({
                  title: v.title,
                  amount: v.amount,
                  category: v.category,
                  is_estimated: v.is_estimated,
                  expense_date: v.expense_date,
                  notes: v.notes,
                })
                setShowExpForm(false)
              }}
            />
          </div>
        )}

        <ExpenseList
          items={(trip.expenses ?? []).map((exp) => ({
            id: exp.id,
            title: exp.title,
            amount: Number(exp.amount),
            category: String(exp.category),
            currency: exp.currency,
            expense_date: exp.expense_date,
            notes: exp.notes,
            is_estimated: exp.is_estimated,
          }))}
          onDelete={isDemo ? undefined : (id) => delExp.mutate(id)}
          emptyMessage={t.trips.noExpenses}
        />
      </section>
    </div>
  )
}
