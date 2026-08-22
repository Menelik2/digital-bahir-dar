import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet,
  MapPin,
  Utensils,
  Hotel,
  Landmark,
  Bus,
  Coffee,
  ArrowRight,
  AlertTriangle,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/store'
import { buildSpendGuide, TIER_LABEL, type SpendTier } from '@/utils/spendGuide'
import { formatMoney } from '@/utils/budget'
import { cn } from '@/lib/utils'

const iconFor = (cat: string) => {
  switch (cat) {
    case 'hotel':
      return Hotel
    case 'restaurant':
      return Utensils
    case 'attraction':
      return Landmark
    case 'transport':
      return Bus
    case 'cafe':
      return Coffee
    default:
      return MapPin
  }
}

const tierColor = (t: SpendTier) =>
  t === 'budget'
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
    : t === 'mid'
      ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200'
      : 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200'

export default function SpendGuidePage() {
  const { currency } = useAppStore()
  const [cash, setCash] = useState(15000)
  const [days, setDays] = useState(3)
  const [travelers, setTravelers] = useState(2)
  const [priority, setPriority] = useState<'balanced' | 'sleep' | 'food' | 'see'>('balanced')

  const guide = useMemo(
    () => buildSpendGuide({ cash, days, travelers, priority }),
    [cash, days, travelers, priority]
  )

  const dayPlanTotal = guide.sampleDay.reduce((s, i) => s + i.estCost, 0)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <Sparkles className="h-7 w-7 text-sky-600" /> Spend Guide
        </h1>
        <p className="mt-1 text-slate-500">
          Tell us how much money you have — we suggest hotels, food, and places to visit in Bahir Dar,
          with a simple day plan. Estimates in {currency}; confirm real prices locally.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Money you have for this trip ({currency})
            </label>
            <input
              type="number"
              min={0}
              step={500}
              value={cash}
              onChange={(e) => setCash(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-lg font-semibold outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Days in Bahir Dar</label>
            <input
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Travelers</label>
            <input
              type="number"
              min={1}
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, Number(e.target.value) || 1))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Spend priority</label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['balanced', 'Balanced'],
                  ['sleep', 'Better hotel'],
                  ['food', 'More food'],
                  ['see', 'More sights'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPriority(id)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition',
                    priority === id
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-sky-200 dark:border-sky-900">
        <CardContent className="p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', tierColor(guide.tier))}>
              {TIER_LABEL[guide.tier]} plan
            </span>
            <span className="text-xs text-slate-500">
              ~{formatMoney(guide.dailyBudget, currency)} / day total ·{' '}
              {formatMoney(guide.perPersonTotal, currency)} / person trip
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{guide.summary.replace(/\*\*/g, '')}</p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {(
              [
                ['Hotel', guide.allocation.lodging],
                ['Food', guide.allocation.food],
                ['Sights', guide.allocation.attractions],
                ['Transport', guide.allocation.transport],
                ['Buffer', guide.allocation.buffer],
              ] as const
            ).map(([label, amt]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-900/50">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
                <p className="text-sm font-semibold">{amt.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {guide.warnings.length > 0 && (
        <div className="mb-6 space-y-2">
          {guide.warnings.map((w) => (
            <div
              key={w}
              className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {w}
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <Wallet className="h-5 w-5 text-sky-600" /> Where you can go
      </h2>
      <div className="mb-8 space-y-3">
        {guide.suggestions.map((s) => {
          const Icon = iconFor(s.category)
          return (
            <Card key={s.category + s.title}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{s.title}</h3>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', tierColor(s.tier))}>
                        {TIER_LABEL[s.tier]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{s.why}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Typical: ~{s.estCostPerUnit.toLocaleString()} {currency} / {s.unit}
                    </p>
                    <ul className="mt-2 list-inside list-disc text-xs text-slate-500">
                      {s.tips.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <Link to={s.explorePath} className="mt-3 inline-flex">
                      <Button size="sm" variant="outline">
                        Browse {s.category === 'cafe' ? 'places' : s.category + 's'}{' '}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <h2 className="mb-3 text-lg font-semibold">Sample day plan</h2>
      <Card className="mb-6">
        <CardContent className="divide-y divide-slate-100 p-0 dark:divide-slate-800">
          {guide.sampleDay.map((item) => (
            <div key={item.time + item.title} className="flex gap-3 px-4 py-3">
              <div className="w-20 shrink-0 text-xs font-medium text-sky-600">{item.time}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                {item.note && <p className="text-xs text-slate-500">{item.note}</p>}
              </div>
              <div className="shrink-0 text-sm font-semibold tabular-nums">
                {item.estCost > 0 ? `${Math.round(item.estCost).toLocaleString()} ${currency}` : '—'}
              </div>
            </div>
          ))}
          <div className="flex justify-between px-4 py-3 text-sm font-semibold">
            <span>Sample day total (illustrative)</span>
            <span>
              {Math.round(dayPlanTotal).toLocaleString()} {currency}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-center gap-2">
        <Link to="/budget">
          <Button variant="outline">Detailed budget calculator</Button>
        </Link>
        <Link to="/map">
          <Button>
            Open map <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/ai-guide">
          <Button variant="outline">Ask AI Guide</Button>
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Not financial advice. Hotel, food, and ticket prices change — always verify in Bahir Dar before you pay.
      </p>
    </div>
  )
}
