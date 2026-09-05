import { useMemo, useState } from 'react'
import {
  Sparkles,
  Calendar,
  Users,
  Wallet,
  Clock,
  Loader2,
  Copy,
  Check,
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
    setInterests((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
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
            <h1 className="text-[28px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-3xl">{t.planner.title}</h1>
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
                <Button type="button" variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={() => setTravelers((n) => Math.max(1, n - 1))}>−</Button>
                <span className="w-8 text-center text-lg font-bold">{travelers}</span>
                <Button type="button" variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={() => setTravelers((n) => Math.min(12, n + 1))}>+</Button>
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
              <p className="text-xs font-medium uppercase tracking-wide text-[#056b24] dark:text-[#30d158]">{t.planner.estimatedTotal}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {plan.budget.total.toLocaleString()} {plan.budget.currency}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                ~{plan.budget.perPerson.toLocaleString()} {t.planner.perPerson} · ~{plan.budget.perDay.toLocaleString()} / {t.planner.day.toLowerCase()}
              </p>
            </CardContent>
          </Card>

          {plan.days.map((d) => (
            <Card key={d.dayNumber} className="overflow-hidden border-black/[0.06] dark:border-white/[0.08]">
              <div className="border-b border-black/[0.05] bg-[#f2f2f7]/80 px-4 py-3 dark:border-white/[0.08] dark:bg-[#1c1c1e]/60">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#078930]">{t.planner.day} {d.dayNumber}</p>
                <h3 className="text-[17px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white">{d.title}</h3>
                <p className="mt-1 text-[13px] text-[#8e8e93]">{d.summary}</p>
              </div>
              <CardContent className="space-y-0 p-0">
                {d.stops.map((s, i) => (
                  <div key={i} className="flex gap-3 border-t border-black/[0.04] px-4 py-3 first:border-t-0 dark:border-white/[0.06]">
                    <span className="w-12 shrink-0 text-[11px] font-semibold text-[#8e8e93]">{s.time || '—'}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#1c1c1e] dark:text-white">{s.name}</p>
                      {s.notes && <p className="mt-0.5 text-[13px] text-[#8e8e93]">{s.notes}</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={loadStory} disabled={storyLoading}>
              {storyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {storyLoading ? t.planner.writing : t.planner.generateAi}
            </Button>
          </div>
          {story && <p className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-900">{story}</p>}
        </div>
      )}
    </div>
  )
}
