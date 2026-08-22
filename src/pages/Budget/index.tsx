import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, Calculator, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EXPENSE_CATEGORIES } from '@/types/trip'
import { useAppStore } from '@/store'
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

  const breakdown = useMemo(() => {
    const lodging = lodgingPerNight * nights * Math.max(1, Math.ceil(travelers / 2))
    const food = foodPerDay * (nights + 1) * travelers
    const transportTotal = transport
    const attractionsTotal = attractions * travelers
    const shoppingTotal = shopping
    const otherTotal = other
    const total = lodging + food + transportTotal + attractionsTotal + shoppingTotal + otherTotal
    const perPerson = travelers > 0 ? total / travelers : total
    const remaining = budgetCap - total
    return { lodging, food, transport: transportTotal, attraction: attractionsTotal, shopping: shoppingTotal, other: otherTotal, total, perPerson, remaining }
  }, [travelers, nights, lodgingPerNight, foodPerDay, transport, attractions, shopping, other, budgetCap])

  const field = (label: string, value: number, onChange: (n: number) => void, opts?: { min?: number }) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      <input type="number" min={opts?.min ?? 0} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950" />
    </div>
  )

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <Calculator className="h-7 w-7 text-sky-600" /> Budget planner
        </h1>
        <p className="mt-1 text-slate-500">Estimate costs for a Bahir Dar trip. Figures are planning tools only — verify local prices.</p>
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

      <Card className="mb-6 border-sky-200 dark:border-sky-900">
        <CardContent className="p-4">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Wallet className="h-5 w-5 text-sky-600" /> Estimate summary
          </h2>
          <div className="space-y-2 text-sm">
            {([['lodging', breakdown.lodging], ['food', breakdown.food], ['transport', breakdown.transport], ['attraction', breakdown.attraction], ['shopping', breakdown.shopping], ['other', breakdown.other]] as const).map(([cat, amt]) => (
              <div key={cat} className="flex justify-between">
                <span className="capitalize text-slate-500">{EXPENSE_CATEGORIES.find((c) => c.id === cat)?.label ?? cat}</span>
                <span className="font-medium">{amt.toLocaleString()} {currency}</span>
              </div>
            ))}
            <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
            <div className="flex justify-between text-base font-semibold">
              <span>Total estimated</span>
              <span>{breakdown.total.toLocaleString()} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-slate-500"><Users className="h-3.5 w-3.5" /> Per person</span>
              <span>{Math.round(breakdown.perPerson).toLocaleString()} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">vs budget cap</span>
              <span className={cn('font-semibold', breakdown.remaining < 0 ? 'text-red-600' : 'text-emerald-600')}>
                {breakdown.remaining >= 0 ? '+' : ''}{breakdown.remaining.toLocaleString()} {currency}
              </span>
            </div>
          </div>
          {breakdown.remaining < 0 && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
              Estimate exceeds your budget. Reduce nights, lodging, or other categories.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700">
        <p className="mb-3 text-sm text-slate-500">Save this plan as a trip with a full itinerary and tracked expenses.</p>
        <Link to="/trips"><Button>Open My Trips <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Prices are illustrative defaults for planning. Always confirm current rates locally.
      </p>
    </div>
  )
}
