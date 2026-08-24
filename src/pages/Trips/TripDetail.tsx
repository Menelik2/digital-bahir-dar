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

export default function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { data: trip, isLoading, error } = useTrip(tripId)
  const isDemo = tripId?.startsWith('demo-')

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
        <h1 className="mb-2 text-xl font-semibold">Trip not found</h1>
        <Link to="/trips">
          <Button variant="outline">Back to trips</Button>
        </Link>
      </div>
    )
  }

  const budget = computeBudget(trip)
  const nextDayNum = (trip.days?.length ?? 0) + 1
  const usedPct = budget.usedPercent ?? null
  const logged = budget.loggedExpenses ?? 0
  const stops = budget.stopEstimates ?? 0

  const handleAddStop = async (dayId: string) => {
    if (!stopName.trim() || isDemo) return
    try {
      await addStop.mutateAsync({ tripDayId: dayId, custom_name: stopName.trim() })
      setStopName('')
      setStopDayId(null)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-start gap-3">
        <Link to="/trips">
          <Button size="icon" variant="outline" className="shrink-0 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{trip.title}</h1>
            {isDemo && (
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                DEMO
              </span>
            )}
          </div>
          {trip.description && <p className="mt-1 text-sm text-slate-500">{trip.description}</p>}
          <p className="mt-1 text-xs capitalize text-slate-400">
            {trip.status} · {trip.traveler_count} traveler{trip.traveler_count !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {isDemo && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          DEMO itinerary for UI preview. Create a real trip to save days, stops, and expenses to
          Supabase. You can still use the{' '}
          <Link to="/expenses" className="font-medium underline">
            offline expense tracker
          </Link>
          .
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold">
              <Wallet className="h-5 w-5 text-sky-600" /> Budget & spending
            </h2>
            <div className="flex gap-3 text-sm">
              <Link to="/expenses" className="text-sky-600 hover:underline">
                Tracker
              </Link>
              <Link to="/budget" className="text-sky-600 hover:underline">
                Calculator
              </Link>
            </div>
          </div>

          {usedPct != null && (
            <div className="mb-3">
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Budget used (logged + stop estimates)</span>
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
              <p className="text-xs text-slate-400">Budget</p>
              <p className="font-semibold">
                {budget.budgetTotal != null
                  ? formatMoney(budget.budgetTotal, budget.currency)
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Projected total</p>
              <p className="font-semibold">
                {formatMoney(budget.totalExpenses, budget.currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Remaining</p>
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
              <p className="text-xs text-slate-400">Per person</p>
              <p className="font-semibold">
                {formatMoney(Math.round(budget.perPerson ?? 0), budget.currency)}
              </p>
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Logged expenses: {formatMoney(logged, budget.currency)}
            {' · '}
            Actual: {formatMoney(budget.actualOnly ?? 0, budget.currency)}
            {' · '}
            Estimated (logged): {formatMoney(budget.estimatedOnly ?? 0, budget.currency)}
            {stops > 0 && (
              <>
                {' · '}
                Stop estimates: {formatMoney(stops, budget.currency)}
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
                  stops (plan): {stops.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Itinerary</h2>
          {!isDemo && (
            <Button
              size="sm"
              variant="outline"
              disabled={addDay.isPending}
              onClick={() => addDay.mutate(nextDayNum)}
            >
              <Plus className="h-4 w-4" /> Day {nextDayNum}
            </Button>
          )}
        </div>

        {(!trip.days || trip.days.length === 0) && (
          <p className="text-sm text-slate-500">No days yet. Add Day 1 to start planning.</p>
        )}

        <div className="space-y-4">
          {trip.days?.map((day) => (
            <Card key={day.id}>
              <CardContent className="p-4">
                <h3 className="mb-3 font-semibold">
                  Day {day.day_number}
                  {day.title && day.title !== `Day ${day.day_number}` && (
                    <span className="font-normal text-slate-500"> — {day.title}</span>
                  )}
                </h3>
                <ul className="space-y-2">
                  {day.stops?.map((stop) => (
                    <li
                      key={stop.id}
                      className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50"
                    >
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          {stop.custom_name || stop.place?.name || 'Stop'}
                        </p>
                        {(stop.start_time || stop.estimated_cost) && (
                          <p className="mt-0.5 flex flex-wrap gap-2 text-xs text-slate-500">
                            {stop.start_time && (
                              <span className="flex items-center gap-0.5">
                                <Clock className="h-3 w-3" /> {stop.start_time}
                                {stop.end_time && `–${stop.end_time}`}
                              </span>
                            )}
                            {stop.estimated_cost != null && (
                              <span>
                                ~{Number(stop.estimated_cost).toLocaleString()} {trip.currency}
                              </span>
                            )}
                          </p>
                        )}
                        {stop.notes && <p className="mt-1 text-xs text-slate-500">{stop.notes}</p>}
                      </div>
                      {!isDemo && (
                        <button
                          type="button"
                          className="text-slate-400 hover:text-red-500"
                          onClick={() => delStop.mutate(stop.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                {!isDemo && (
                  <div className="mt-3">
                    {stopDayId === day.id ? (
                      <div className="flex gap-2">
                        <input
                          value={stopName}
                          onChange={(e) => setStopName(e.target.value)}
                          placeholder="Stop name"
                          className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddStop(day.id)}
                        />
                        <Button size="sm" onClick={() => handleAddStop(day.id)}>
                          Add
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setStopDayId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => setStopDayId(day.id)}>
                        <Plus className="h-3.5 w-3.5" /> Add stop
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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Receipt className="h-5 w-5 text-sky-600" /> Expenses
          </h2>
          {!isDemo && (
            <Button size="sm" variant="outline" onClick={() => setShowExpForm(!showExpForm)}>
              <Plus className="h-4 w-4" /> Expense
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
          emptyMessage="No expenses logged yet. Add food, transport, or activity costs."
        />
      </section>
    </div>
  )
}
