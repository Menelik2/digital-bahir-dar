import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, Calculator, Users, ArrowRight, Moon, BedDouble } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EXPENSE_CATEGORIES } from '@/types/trip'
import { useAppStore } from '@/store'
import { estimateTripBudget, formatMoney } from '@/utils/budget'
import { cn } from '@/lib/utils'

export default function BudgetPage() {
  const { currency } = useAppStore()
  const [travelers, setTravelers] = useState(2)
  const [nights, setNights] = useState(2)
  const [lodgingPerNight, setLodgingPerNight] = useState(2500)
  const [foodPerDay, setFoodPerDay] = useState(800)
  const [transport, setTransport] = useState(1500)
  const [attractions, setAttractions] = useState(2000)
  const [shopping, setShopping] = useState(1000)
  const [other, setOther] = useState(500)
  const [budgetCap, setBudgetCap] = useState(20000)

  const breakdown = useMemo(
    () =>
      estimateTripBudget({
        travelers,
        nights,
        lodgingPerNight,
        foodPerDay,
        transportTotal: transport,
        attractionsPerPerson: attractions,
        shopping,
        other,
        budgetCap,
      }),
    [travelers, nights, lodgingPerNight, foodPerDay, transport, attractions, shopping, other, budgetCap]
  )

  const field = (
    label: string,
    value: number,
    onChange: (n: number) => void,
    opts?: { min?: number }
  ) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      <input
        type="number"
        min={opts?.min ?? 0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
      />
    </div>
  )

  const rows: { id: string; amount: number }[] = [
    { id: 'lodging', amount: breakdown.lodging },
    { id: 'food', amount: breakdown.food },
    { id: 'transport', amount: breakdown.transport },
    { id: 'attraction', amount: breakdown.attraction },
    { id: 'shopping', amount: breakdown.shopping },
    { id: 'other', amount: breakdown.other },
  ]

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <Calculator className="h-7 w-7 text-sky-600" /> Budget planner
        </h1>
        <p className="mt-1 text-slate-500">
          Estimate costs for a Bahir Dar trip. Figures are planning tools only — verify local prices.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
          {field('Travelers', travelers, setTravelers, { min: 1 })}
          {field('Nights', nights, setNights, { min: 0 })}
          {field(`Lodging per night (${currency})`, lodgingPerNight, setLodgingPerNight)}
          {field(`Food per person / day (${currency})`, foodPerDay, setFoodPerDay)}
          {field(`Transport total (${currency})`, transport, setTransport)}
          {field(`Attractions per person (${currency})`, attractions, setAttractions)}
          {field(`Shopping (${currency})`, shopping, setShopping)}
          {field(`Other (${currency})`, other, setOther)}
          {field(`Your budget cap (${currency})`, budgetCap, setBudgetCap)}
        </CardContent>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-3 text-center">
            <BedDouble className="mx-auto mb-1 h-4 w-4 text-sky-600" />
            <p className="text-xs text-slate-500">Rooms</p>
            <p className="font-semibold">{breakdown.rooms}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Moon className="mx-auto mb-1 h-4 w-4 text-sky-600" />
            <p className="text-xs text-slate-500">Food days</p>
            <p className="font-semibold">{breakdown.foodDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="mx-auto mb-1 h-4 w-4 text-sky-600" />
            <p className="text-xs text-slate-500">Per person</p>
            <p className="font-semibold">{Math.round(breakdown.perPerson).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Wallet className="mx-auto mb-1 h-4 w-4 text-sky-600" />
            <p className="text-xs text-slate-500">Per day</p>
            <p className="font-semibold">{Math.round(breakdown.perDay).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 border-sky-200 dark:border-sky-900">
        <CardContent className="p-4">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Wallet className="h-5 w-5 text-sky-600" /> Estimate summary
          </h2>

          {breakdown.usedPercent != null && (
            <div className="mb-4">
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Budget used</span>
                <span>{breakdown.usedPercent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    (breakdown.usedPercent ?? 0) > 100
                      ? 'bg-red-500'
                      : (breakdown.usedPercent ?? 0) > 80
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                  )}
                  style={{ width: `${Math.min(100, breakdown.usedPercent ?? 0)}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm">
            {rows.map(({ id, amount }) => (
              <div key={id} className="flex justify-between">
                <span className="capitalize text-slate-500">
                  {EXPENSE_CATEGORIES.find((c) => c.id === id)?.label ?? id}
                </span>
                <span className="font-medium">
                  {amount.toLocaleString()} {currency}
                </span>
              </div>
            ))}
            <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
            <div className="flex justify-between text-base font-semibold">
              <span>Total estimated</span>
              <span>{formatMoney(breakdown.total, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-slate-500">
                <Users className="h-3.5 w-3.5" /> Per person
              </span>
              <span>
                {Math.round(breakdown.perPerson).toLocaleString()} {currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">vs budget cap</span>
              <span
                className={cn(
                  'font-semibold',
                  (breakdown.remaining ?? 0) < 0 ? 'text-red-600' : 'text-emerald-600'
                )}
              >
                {(breakdown.remaining ?? 0) >= 0 ? '+' : ''}
                {(breakdown.remaining ?? 0).toLocaleString()} {currency}
              </span>
            </div>
          </div>

          {(breakdown.remaining ?? 0) < 0 && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
              Estimate exceeds your budget by{' '}
              {Math.abs(breakdown.remaining ?? 0).toLocaleString()} {currency}. Reduce nights,
              lodging, or other categories.
            </p>
          )}

          <p className="mt-3 text-xs text-slate-400">
            Lodging uses {breakdown.rooms} room(s) × {nights} night(s). Food uses {breakdown.foodDays}{' '}
            day(s) × {travelers} traveler(s).
          </p>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700">
        <p className="mb-3 text-sm text-slate-500">
          Save this plan as a trip with a full itinerary and tracked expenses.
        </p>
        <Link to="/trips">
          <Button>
            Open My Trips <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Prices are illustrative defaults for planning. Always confirm current rates locally.
      </p>
    </div>
  )
}
