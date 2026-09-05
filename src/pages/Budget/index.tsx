import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, Calculator, Users, ArrowRight, Moon, BedDouble, Receipt, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className="ios-group-row ios-group-row-stack ios-group-row-fullsep">
      <label className="text-[13px] font-medium text-[#8e8e93]">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        min={opts?.min ?? 0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="min-h-[44px] w-full rounded-xl border-0 bg-[#f2f2f7] px-3 text-[16px] font-medium outline-none ring-1 ring-black/[0.06] focus:ring-2 focus:ring-[#078930]/30 dark:bg-[#2c2c2e] dark:ring-white/10 dark:focus:ring-[#30d158]/35"
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
    <div className="mx-auto max-w-2xl bg-[#f2f2f7] px-4 pb-nav-safe pt-6 dark:bg-black sm:pt-8">
      <div className="mb-5">
        <h1 className="ios-large-title flex items-center gap-2 text-[#1c1c1e] dark:text-white">
          <Calculator className="h-7 w-7 shrink-0 text-[#0b6e99]" /> {b.title}
        </h1>
        <p className="mt-1.5 text-[15px] leading-relaxed text-[#8e8e93]">{b.subtitle}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link to="/spend-guide" className="min-w-[140px] flex-1">
          <Button className="h-11 w-full rounded-full bg-gradient-to-r from-[#0b6e99] to-[#078930] text-[15px] font-semibold shadow-md">
            <Sparkles className="h-4 w-4" /> {b.spendGuide}
          </Button>
        </Link>
        <Link to="/expenses" className="min-w-[140px] flex-1">
          <Button variant="outline" className="h-11 w-full rounded-full border-black/10 text-[15px] dark:border-white/15">
            <Receipt className="h-4 w-4" /> {b.trackExpenses}
          </Button>
        </Link>
      </div>

      <div className="ios-card mb-5 overflow-hidden rounded-2xl border border-black/[0.04] bg-gradient-to-br from-[#0b6e99]/10 to-[#078930]/5 p-4 dark:border-white/[0.08] dark:from-[#0b6e99]/20 dark:to-[#078930]/10">
        <p className="font-semibold text-[#1c1c1e] dark:text-white">{b.cashIdeasTitle}</p>
        <p className="mt-1 text-[14px] leading-relaxed text-[#3c3c43] dark:text-white/70">{b.cashIdeasBody}</p>
        <Link to="/spend-guide" className="mt-3 inline-flex">
          <Button size="sm" className="h-9 rounded-full bg-[#0b6e99] text-white">
            {b.openSpendGuide} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <section className="ios-section">
        <p className="ios-section-label">Inputs</p>
        <div className="ios-group ios-group-fullsep">
          <div className="grid sm:grid-cols-2">
            {field(b.travelers, travelers, setTravelers, { min: 1 })}
            {field(b.nights, nights, setNights, { min: 0 })}
            {field(`${b.lodgingPerNight} (${currency})`, lodgingPerNight, setLodgingPerNight)}
            {field(`${b.foodPerDay} (${currency})`, foodPerDay, setFoodPerDay)}
            {field(`${b.transportTotal} (${currency})`, transport, setTransport)}
            {field(`${b.attractionsPerPerson} (${currency})`, attractions, setAttractions)}
            {field(`${b.shopping} (${currency})`, shopping, setShopping)}
            {field(`${b.other} (${currency})`, other, setOther)}
            {field(`${b.budgetCap} (${currency})`, budgetCap, setBudgetCap)}
          </div>
        </div>
      </section>

      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          { icon: BedDouble, label: b.rooms, value: breakdown.rooms },
          { icon: Moon, label: b.foodDays, value: breakdown.foodDays },
          { icon: Users, label: b.perPerson, value: Math.round(breakdown.perPerson).toLocaleString() },
          { icon: Wallet, label: b.perDay, value: Math.round(breakdown.perDay).toLocaleString() },
        ].map((s) => (
          <div
            key={s.label}
            className="ios-card rounded-2xl border border-black/[0.04] bg-white p-3 text-center shadow-sm dark:border-white/[0.08] dark:bg-[#1c1c1e]"
          >
            <s.icon className="mx-auto mb-1 h-4 w-4 text-[#0b6e99]" />
            <p className="text-[11px] text-[#8e8e93]">{s.label}</p>
            <p className="text-[15px] font-semibold text-[#1c1c1e] dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="ios-card mb-5 overflow-hidden rounded-2xl border border-black/[0.04] bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#1c1c1e]">
        <div className="border-b border-black/[0.06] px-4 py-3 dark:border-white/[0.08]">
          <h2 className="flex items-center gap-2 text-[16px] font-semibold text-[#1c1c1e] dark:text-white">
            <Wallet className="h-5 w-5 text-[#078930]" /> {b.summary}
          </h2>
        </div>
        <div className="p-4">
          {breakdown.usedPercent != null && (
            <div className="mb-4">
              <div className="mb-1.5 flex justify-between text-[13px] text-[#8e8e93]">
                <span>{b.budgetUsed}</span>
                <span className="font-medium">{breakdown.usedPercent}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e]">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    (breakdown.usedPercent ?? 0) > 100
                      ? 'bg-[#da121a]'
                      : (breakdown.usedPercent ?? 0) > 80
                        ? 'bg-[#f5c518]'
                        : 'bg-[#078930]'
                  )}
                  style={{ width: `${Math.min(100, breakdown.usedPercent ?? 0)}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-2.5 text-[15px]">
            {rows.map(({ id, amount }) => (
              <div key={id} className="flex justify-between gap-2">
                <span className="text-[#8e8e93]">{catLabel(id)}</span>
                <span className="shrink-0 font-medium text-[#1c1c1e] dark:text-white">
                  {amount.toLocaleString()} {currency}
                </span>
              </div>
            ))}
            <div className="my-2 border-t border-black/[0.06] dark:border-white/[0.1]" />
            <div className="flex justify-between text-[17px] font-bold">
              <span className="text-[#1c1c1e] dark:text-white">{b.totalEstimated}</span>
              <span className="text-[#078930] dark:text-[#30d158]">{formatMoney(breakdown.total, currency)}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="flex items-center gap-1 text-[#8e8e93]">
                <Users className="h-3.5 w-3.5" /> {b.perPerson}
              </span>
              <span className="text-[#1c1c1e] dark:text-white">
                {Math.round(breakdown.perPerson).toLocaleString()} {currency}
              </span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[#8e8e93]">{b.vsCap}</span>
              <span
                className={cn(
                  'font-semibold',
                  (breakdown.remaining ?? 0) < 0 ? 'text-[#da121a]' : 'text-[#078930] dark:text-[#30d158]'
                )}
              >
                {(breakdown.remaining ?? 0) >= 0 ? '+' : ''}
                {(breakdown.remaining ?? 0).toLocaleString()} {currency}
              </span>
            </div>
          </div>

          {(breakdown.remaining ?? 0) < 0 && (
            <p className="mt-3 rounded-xl bg-[#da121a]/10 px-3 py-2.5 text-[13px] leading-relaxed text-[#da121a]">
              {b.exceeds} {Math.abs(breakdown.remaining ?? 0).toLocaleString()} {currency}. {b.exceedsHint}
            </p>
          )}

          <p className="mt-3 text-[12px] leading-relaxed text-[#8e8e93]">{formula}</p>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-dashed border-black/10 bg-white/60 p-4 text-center dark:border-white/15 dark:bg-[#1c1c1e]/60">
        <p className="mb-3 text-[14px] leading-relaxed text-[#8e8e93]">{b.logHint}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link to="/expenses" className="w-full sm:w-auto">
            <Button variant="outline" className="h-11 w-full rounded-full border-black/10 dark:border-white/15">
              <Receipt className="h-4 w-4" /> {b.expenseTracker}
            </Button>
          </Link>
          <Link to="/trips" className="w-full sm:w-auto">
            <Button className="h-11 w-full rounded-full bg-[#078930] text-white hover:bg-[#056b24]">
              {b.openTrips} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <p className="pb-4 text-center text-[12px] leading-relaxed text-[#8e8e93]">{b.footer}</p>
    </div>
  )
}
