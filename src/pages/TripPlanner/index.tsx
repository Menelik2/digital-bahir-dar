import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Calendar,
  Users,
  Wallet,
  MapPin,
  Clock,
  ChevronRight,
  Loader2,
  Copy,
  Check,
  Route,
  Utensils,
  Camera,
  Trees,
  Landmark,
  ShoppingBag,
  Baby,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  buildTripPlan,
  dayActivityTotal,
  narrateTripPlan,
  planToPlainText,
  type PlannerBudget,
  type PlannerInterest,
  type PlannerPace,
  type PlannerResult,
} from '@/services/tripPlanner'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'

const DAY_OPTIONS = [1, 2, 3, 4, 5] as const

function pct(amount: number, total: number) {
  if (!total) return 0
  return Math.round((amount / total) * 1000) / 10
}

export default function TripPlannerPage() {
  const t = useT()
  const [days, setDays] = useState(2)
  const [travelers, setTravelers] = useState(2)
  const [budget, setBudget] = useState<PlannerBudget>('mid')
  const [pace, setPace] = useState<PlannerPace>('moderate')
  const [interests, setInterests] = useState<PlannerInterest[]>(['nature', 'culture'])
  const [includeBoat, setIncludeBoat] = useState(true)
  const [includeFalls, setIncludeFalls] = useState(true)
  const [plan, setPlan] = useState<PlannerResult | null>(null)
  const [story, setStory] = useState<string | null>(null)
  const [storyLoading, setStoryLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const budgetOptions: { id: PlannerBudget; label: string; hint: string }[] = [
    { id: 'budget', label: t.planner.budgetBudget, hint: t.planner.budgetBudgetHint },
    { id: 'mid', label: t.planner.budgetMid, hint: t.planner.budgetMidHint },
    { id: 'comfort', label: t.planner.budgetComfort, hint: t.planner.budgetComfortHint },
  ]
  const paceOptions: { id: PlannerPace; label: string }[] = [
    { id: 'relaxed', label: t.planner.paceRelaxed },
    { id: 'moderate', label: t.planner.paceModerate },
    { id: 'active', label: t.planner.paceActive },
  ]
  const interestOptions: { id: PlannerInterest; label: string; icon: typeof Trees }[] = [
    { id: 'nature', label: t.planner.nature, icon: Trees },
    { id: 'culture', label: t.planner.culture, icon: Landmark },
    { id: 'food', label: t.planner.food, icon: Utensils },
    { id: 'shopping', label: t.planner.shopping, icon: ShoppingBag },
    { id: 'photography', label: t.planner.photos, icon: Camera },
    { id: 'family', label: t.planner.family, icon: Baby },
  ]

  const toggleInterest = (id: PlannerInterest) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const generate = () => {
    const result = buildTripPlan({
      days,
      travelers,
      budget,
      pace,
      interests,
      includeBoat,
      includeFalls,
    })
    setPlan(result)
    setStory(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const loadStory = async () => {
    if (!plan) return
    setStoryLoading(true)
    try {
      const res = await narrateTripPlan(plan)
      setStory(res.text)
    } finally {
      setStoryLoading(false)
    }
  }

  const copyPlan = async () => {
    if (!plan) return
    const text = planToPlainText(plan) + (story ? `\n\n${story}` : '')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert(t.common.error)
    }
  }

  const totalStops = useMemo(
    () => plan?.days.reduce((n, d) => n + d.stops.length, 0) ?? 0,
    [plan]
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-5 pb-nav-safe sm:py-8">
      <div className="mb-5 sm:mb-6">
        <div className="mb-1 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#078930] via-[#0b6e99] to-[#d4a017] text-white shadow-md">
            <Sparkles className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <h1 className="text-[28px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-3xl">
              {t.planner.title}
            </h1>
            <p className="text-[14px] text-[#8e8e93] sm:text-[15px]">{t.planner.subtitle}</p>
          </div>
        </div>
      </div>

      {!plan && (
        <Card className="mb-8 overflow-hidden border-black/[0.06] shadow-sm dark:border-white/[0.08]">
          <div className="h-1.5 bg-gradient-to-r from-[#078930] via-[#0b6e99] to-[#d4a017]" />
          <CardContent className="space-y-6 p-5 sm:p-6">
            <section>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4 text-[#0b6e99]" /> {t.planner.howManyDays}
              </label>
              <div className="flex flex-wrap gap-2">
                {DAY_OPTIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={cn(
                      'h-12 min-w-[3.25rem] rounded-full border text-[15px] font-semibold transition active:scale-[0.97]',
                      days === d
                        ? 'border-[#078930] bg-[#078930] text-white shadow-sm shadow-[#078930]/25'
                        : 'border-black/[0.08] bg-white text-[#1c1c1e] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-white'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4 text-[#0b6e99]" /> {t.planner.travelers}
              </label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={() => setTravelers((n) => Math.max(1, n - 1))}>
                  −
                </Button>
                <span className="w-8 text-center text-lg font-bold">{travelers}</span>
                <Button type="button" variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={() => setTravelers((n) => Math.min(12, n + 1))}>
                  +
                </Button>
              </div>
            </section>

            <section>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Wallet className="h-4 w-4 text-[#0b6e99]" /> {t.planner.budgetStyle}
              </label>
              <div className="grid gap-2 sm:grid-cols-3">
                {budgetOptions.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBudget(b.id)}
                    className={cn(
                      'min-h-[72px] rounded-[1rem] border p-3.5 text-left transition active:scale-[0.98]',
                      budget === b.id
                        ? 'border-[#078930] bg-[#078930]/08 dark:bg-[#078930]/15'
                        : 'border-black/[0.08] bg-white dark:border-white/10 dark:bg-[#1c1c1e]'
                    )}
                  >
                    <p className="font-semibold">{b.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{b.hint}</p>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4 text-[#0b6e99]" /> {t.planner.pace}
              </label>
              <div className="flex flex-wrap gap-2">
                {paceOptions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPace(p.id)}
                    className={cn(
                      'min-h-[40px] rounded-full border px-4 py-2 text-[13px] font-semibold transition active:scale-[0.97]',
                      pace === p.id
                        ? 'border-[#078930] bg-[#078930] text-white shadow-sm'
                        : 'border-black/[0.08] bg-white text-[#1c1c1e] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-white'
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="mb-2 block text-sm font-semibold">{t.planner.interests}</label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((opt) => {
                  const on = interests.includes(opt.id)
                  const Icon = opt.icon
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleInterest(opt.id)}
                      className={cn(
                        'inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition active:scale-[0.97]',
                        on
                          ? 'border-[#0b6e99] bg-[#0b6e99]/12 text-[#0a5a7e] dark:border-[#30d158]/40 dark:bg-[#30d158]/15 dark:text-[#30d158]'
                          : 'border-black/[0.08] bg-white text-[#1c1c1e] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-white'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5 text-[15px]">
                <input type="checkbox" checked={includeBoat} onChange={(e) => setIncludeBoat(e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-[#078930]" />
                {t.planner.includeBoat}
              </label>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5 text-[15px]">
                <input type="checkbox" checked={includeFalls} onChange={(e) => setIncludeFalls(e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-[#078930]" />
                {t.planner.includeFalls}
              </label>
            </section>

            <Button size="lg" className="mobile-cta min-h-[52px] w-full rounded-full text-[16px] shadow-md shadow-[#078930]/25" onClick={generate}>
              <Sparkles className="h-5 w-5" /> {t.planner.buildPlan}
            </Button>
            <p className="text-xs text-slate-400">{t.planner.offlineNote}</p>
          </CardContent>
        </Card>
      )}

      {plan && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#1c1c1e] dark:text-white">{plan.title}</h2>
              <p className="text-sm text-[#8e8e93]">{plan.subtitle}</p>
              <p className="mt-1 text-xs text-[#8e8e93]">
                {totalStops} {t.planner.stopsAcross} {plan.days.length}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="min-h-[40px] rounded-full" onClick={() => setPlan(null)}>
                {t.planner.editChoices}
              </Button>
              <Button variant="outline" size="sm" className="min-h-[40px] rounded-full" onClick={copyPlan}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t.planner.copied : t.planner.copy}
              </Button>
            </div>
          </div>

          <Card className="border-[#078930]/20 bg-gradient-to-br from-[#078930]/08 to-[#0b6e99]/08 dark:border-[#078930]/30 dark:from-[#078930]/15 dark:to-[#0b6e99]/15">
            <CardContent className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#056b24] dark:text-[#30d158]">
                {t.planner.estimatedTotal}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {plan.budget.total.toLocaleString()} {plan.budget.currency}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                ~{plan.budget.perPerson.toLocaleString()} {t.planner.perPerson} · ~
                {plan.budget.perDay.toLocaleString()} / {t.planner.day.toLowerCase()}
              </p>
              <p className="mt-2 text-[11px] text-slate-500">{plan.budget.disclaimer}</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-black/[0.06] dark:border-white/[0.08]">
            <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <h3 className="flex items-center gap-2 font-semibold">
                <Wallet className="h-4 w-4 text-[#078930]" /> {t.planner.pricingBreakdown}
              </h3>
              <p className="text-xs text-slate-500">{t.planner.pricingHint}</p>
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[320px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
                      <th className="px-4 py-2.5 font-medium">{t.planner.category}</th>
                      <th className="px-4 py-2.5 text-right font-medium">{t.planner.amount}</th>
                      <th className="hidden px-4 py-2.5 text-right font-medium sm:table-cell">{t.planner.share}</th>
                      <th className="px-4 py-2.5 text-right font-medium">{t.planner.perPerson}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.budget.lines.map((line) => (
                      <tr key={line.key} className="border-b border-slate-50 dark:border-slate-900">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800 dark:text-slate-100">{line.label}</p>
                          {line.note && <p className="text-[11px] text-slate-400">{line.note}</p>}
                          <div className="mt-1.5 h-1 max-w-[12rem] overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-[#078930]/80" style={{ width: `${Math.min(100, pct(line.amount, plan.budget.total))}%` }} />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold tabular-nums">{line.amount.toLocaleString()}</td>
                        <td className="hidden px-4 py-3 text-right tabular-nums text-slate-500 sm:table-cell">{pct(line.amount, plan.budget.total)}%</td>
                        <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300">{Math.round(line.amount / plan.budget.travelers).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-semibold dark:bg-slate-900/60">
                      <td className="px-4 py-3">{t.planner.total}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-[#056b24] dark:text-[#30d158]">{plan.budget.total.toLocaleString()}</td>
                      <td className="hidden px-4 py-3 text-right sm:table-cell">100%</td>
                      <td className="px-4 py-3 text-right tabular-nums">{plan.budget.perPerson.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {plan.days.map((d) => (
            <Card key={d.dayNumber} className="overflow-hidden border-black/[0.06] dark:border-white/[0.08]">
              <div className="border-b border-black/[0.05] bg-[#f2f2f7]/80 px-4 py-3 dark:border-white/[0.08] dark:bg-[#1c1c1e]/60">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#078930]">
                      {t.planner.day} {d.dayNumber}
                    </p>
                    <h3 className="text-[17px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white">{d.title}</h3>
                  </div>
                  <span className="rounded-full bg-[#078930]/12 px-2.5 py-0.5 text-[12px] font-semibold text-[#056b24] dark:text-[#30d158]">
                    ~{dayActivityTotal(d).toLocaleString()} ETB
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-[#8e8e93]">{d.summary}</p>
              </div>
              <CardContent className="space-y-0 p-0">
                {d.stops.map((s, i) => (
                  <div key={i} className="flex gap-3 border-t border-black/[0.04] px-4 py-3 first:border-t-0 dark:border-white/[0.06]">
                    <div className="flex w-12 shrink-0 flex-col items-center">
                      <span className="text-[11px] font-semibold text-[#8e8e93]">{s.time || '—'}</span>
                      {i < d.stops.length - 1 && <div className="mt-1 w-px flex-1 bg-black/10 dark:bg-white/15" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-[#1c1c1e] dark:text-white">{s.name}</p>
                        {s.estimatedCostEtb != null && s.estimatedCostEtb > 0 && (
                          <span className="text-[12px] font-medium text-[#078930]">~{s.estimatedCostEtb.toLocaleString()} ETB</span>
                        )}
                      </div>
                      {s.duration && <p className="text-[12px] text-[#8e8e93]">{s.duration}</p>}
                      {s.notes && <p className="mt-0.5 text-[13px] leading-snug text-[#8e8e93]">{s.notes}</p>}
                    </div>
                  </div>
                ))}
                {(d.mealsTip || d.transportTip) && (
                  <div className="mx-4 mb-3 rounded-xl bg-amber-50 px-3 py-2 text-[12px] text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                    {d.mealsTip && <p>{d.mealsTip}</p>}
                    {d.transportTip && <p className="mt-0.5">{d.transportTip}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {plan.tips.length > 0 && (
            <Card className="border-black/[0.06] dark:border-white/[0.08]">
              <CardContent className="p-4">
                <p className="mb-2 text-sm font-semibold">{t.planner.tips}</p>
                <ul className="space-y-2">
                  {plan.tips.map((tip) => (
                    <li key={tip} className="flex gap-2 text-[14px] leading-relaxed text-[#3c3c43] dark:text-white/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#078930]" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card className="border-black/[0.06] dark:border-white/[0.08]">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{t.planner.tripStory}</p>
                {!story && (
                  <Button size="sm" variant="outline" className="min-h-[36px] rounded-full" disabled={storyLoading} onClick={loadStory}>
                    {storyLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    {storyLoading ? t.planner.writing : t.planner.generateAi}
                  </Button>
                )}
              </div>
              {story ? (
                <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-[#3c3c43] dark:text-white/85">{story}</p>
              ) : (
                <p className="text-[13px] text-[#8e8e93]">{t.planner.storyHint}</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            <Link to="/map">
              <Button variant="outline" className="min-h-[48px] w-full justify-start rounded-full">
                <MapPin className="h-4 w-4" /> {t.planner.openMap}
              </Button>
            </Link>
            <Link to="/budget">
              <Button variant="outline" className="min-h-[48px] w-full justify-start rounded-full">
                <Wallet className="h-4 w-4" /> {t.planner.adjustBudget}
              </Button>
            </Link>
            <Link to="/trips">
              <Button variant="outline" className="min-h-[48px] w-full justify-start rounded-full">
                <Route className="h-4 w-4" /> {t.planner.readyMade}
              </Button>
            </Link>
            <Link to="/ai-guide">
              <Button variant="outline" className="min-h-[48px] w-full justify-start rounded-full">
                <Sparkles className="h-4 w-4" /> {t.planner.askAi}
              </Button>
            </Link>
          </div>

          {plan.matchedGuideId && (
            <p className="text-center text-sm text-slate-500">
              {t.planner.similarGuide}{' '}
              <Link to={`/trips/${plan.matchedGuideId}`} className="font-medium text-[#0b6e99] hover:underline">
                {t.planner.viewGuide}
              </Link>
            </p>
          )}

          <Button className="mobile-cta min-h-[52px] w-full rounded-full text-[16px]" onClick={generate}>
            <Sparkles className="h-5 w-5" /> {t.planner.regenerate}
          </Button>
        </div>
      )}
    </div>
  )
}
