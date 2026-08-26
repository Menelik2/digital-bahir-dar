import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, Calculator, Users, ArrowRight, Moon, BedDouble, Receipt, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/store'
import { estimateTripBudget, formatMoney } from '@/utils/budget'
import { cn } from '@/lib/utils'
import { useBudgetUi } from '@/i18n/budgetUi'

export default function BudgetPage() {
  const { currency, language } = useAppStore()
  const b = useBudgetUi(language)
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

  const catLabel = (id: string) => {
    const map: Record<string, string> = {
      lodging: b.lodging,
      food: b.food,
      transport: b.transport,
      attraction: b.attraction,
      shopping: b.shopping,
      other: b.other,
    }
    return map[id] ?? id
  }

  const rows: { id: string; amount: number }[] = [
    { id: 'lodging', amount: breakdown.lodging },
    { id: 'food', amount: breakdown.food },
    { id: 'transport', amount: breakdown.transport },
    { id: 'attraction', amount: breakdown.attraction },
    { id: 'shopping', amount: breakdown.shopping },
    { id: 'other', amount: breakdown.other },
  ]

  const formula = b.formula
    .replace('{rooms}', String(breakdown.rooms))
    .replace('{nights}', String(nights))
    .replace('{foodDays}', String(breakdown.foodDays))
    .replace('{travelers}', String(travelers))

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 font-sans">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
            <Calculator className="h-7 w-7 shrink-0 text-sky-600" /> {b.title}
          </h1>
          <p className="mt-1 text-[15px] leading-relaxed text-slate-500">{b.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/spend-guide">
            <Button size="sm" className="bg-gradient-to-r from-sky-500 to-teal-600">
              <Sparkles className="h-4 w-4" /> {b.spendGuide}
            </Button>
          </Link>
          <Link to="/expenses">
            <Button variant="outline" size="sm">
              <Receipt className="h-4 w-4" /> {b.trackExpenses}
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6 border-dashed border-sky-300 bg-sky-50/50 dark:border-sky-800 dark:bg-sky-950/20">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <p className="font-medium">{b.cashIdeasTitle}</p>
            <p className="text-sm leading-relaxed text-slate-500">{b.cashIdeasBody}</p>
          </div>
          <Link to="/spend-guide">
            <Button size="sm">
              {b.openSpendGuide} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
          {field(b.travelers, travelers, setTravelers, { min: 1 })}
          {field(b.nights, nights, setNights, { min: 0 })}
          {field(`${b.lodgingPerNight} (${currency})`, lodgingPerNight, setLodgingPerNight)}
          {field(`${b.foodPerDay} (${currency})`, foodPerDay, setFoodPerDay)}
          {field(`${b.transportTotal} (${currency})`, transport, setTransport)}
          {field(`${b.attractionsPerPerson} (${currency})`, attractions, setAttractions)}
          {field(`${b.shopping} (${currency})`, shopping, setShopping)}
          {field(`${b.other} (${currency})`, other, setOther)}
          {field(`${b.budgetCap} (${currency})`, budgetCap, setBudgetCap)}
        </CardContent>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-3 text-center">
            <BedDouble className="mx-auto mb-1 h-4 w-4 text-sky-600" />
            <p className="text-xs text-slate-500">{b.rooms}</p>
            <p className="font-semibold">{breakdown.rooms}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Moon className="mx-auto mb-1 h-4 w-4 text-sky-600" />
            <p className="text-xs text-slate-500">{b.foodDays}</p>
            <p className="font-semibold">{breakdown.foodDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="mx-auto mb-1 h-4 w-4 text-sky-600" />
            <p className="text-xs text-slate-500">{b.perPerson}</p>
            <p className="font-semibold">{Math.round(breakdown.perPerson).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Wallet className="mx-auto mb-1 h-4 w-4 text-sky-600" />
            <p className="text-xs text-slate-500">{b.perDay}</p>
            <p className="font-semibold">{Math.round(breakdown.perDay).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 border-sky-200 dark:border-sky-900">
        <CardContent className="p-4">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Wallet className="h-5 w-5 text-sky-600" /> {b.summary}
          </h2>

          {breakdown.usedPercent != null && (
            <div className="mb-4">
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>{b.budgetUsed}</span>
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
              <div key={id} className="flex justify-between gap-2">
                <span className="text-slate-500">{catLabel(id)}</span>
                <span className="shrink-0 font-medium">
                  {amount.toLocaleString()} {currency}
                </span>
              </div>
            ))}
            <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
            <div className="flex justify-between text-base font-semibold">
              <span>{b.totalEstimated}</span>
              <span>{formatMoney(breakdown.total, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-slate-500">
                <Users className="h-3.5 w-3.5" /> {b.perPerson}
              </span>
              <span>
                {Math.round(breakdown.perPerson).toLocaleString()} {currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{b.vsCap}</span>
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
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {b.exceeds} {Math.abs(breakdown.remaining ?? 0).toLocaleString()} {currency}.{' '}
              {b.exceedsHint}
            </p>
          )}

          <p className="mt-3 text-xs leading-relaxed text-slate-400">{formula}</p>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700">
        <p className="mb-3 text-sm leading-relaxed text-slate-500">{b.logHint}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link to="/expenses">
            <Button variant="outline">
              <Receipt className="h-4 w-4" /> {b.expenseTracker}
            </Button>
          </Link>
          <Link to="/trips">
            <Button>
              {b.openTrips} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">{b.footer}</p>
    </div>
  )
}
