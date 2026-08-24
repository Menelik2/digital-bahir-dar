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
  narrateTripPlan,
  planToPlainText,
  type PlannerBudget,
  type PlannerInterest,
  type PlannerPace,
  type PlannerResult,
} from '@/services/tripPlanner'
import { cn } from '@/lib/utils'

const DAY_OPTIONS = [1, 2, 3, 4, 5] as const
const BUDGET_OPTIONS: { id: PlannerBudget; label: string; hint: string }[] = [
  { id: 'budget', label: 'Budget', hint: 'Guesthouse · local food · shared boats' },
  { id: 'mid', label: 'Mid', hint: 'Comfortable hotel · mix of local & lakeside' },
  { id: 'comfort', label: 'Comfort', hint: 'Lakeside stay · easier transport' },
]
const PACE_OPTIONS: { id: PlannerPace; label: string }[] = [
  { id: 'relaxed', label: 'Relaxed' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'active', label: 'Active' },
]
const INTEREST_OPTIONS: { id: PlannerInterest; label: string; icon: typeof Trees }[] = [
  { id: 'nature', label: 'Nature', icon: Trees },
  { id: 'culture', label: 'Culture', icon: Landmark },
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'photography', label: 'Photos', icon: Camera },
  { id: 'family', label: 'Family', icon: Baby },
]

export default function TripPlannerPage() {
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
      alert('Could not copy — select the text manually.')
    }
  }

  const totalStops = useMemo(
    () => plan?.days.reduce((n, d) => n + d.stops.length, 0) ?? 0,
    [plan]
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-teal-500 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">AI Trip Planner</h1>
            <p className="text-sm text-slate-500">
              Answer a few easy questions — get a clear day-by-day Bahir Dar plan
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      {!plan && (
        <Card className="mb-8 overflow-hidden border-sky-100 dark:border-sky-900">
          <div className="h-1.5 bg-gradient-to-r from-sky-500 via-teal-500 to-amber-400" />
          <CardContent className="space-y-6 p-5 sm:p-6">
            {/* Days */}
            <section>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4 text-sky-600" /> How many days?
              </label>
              <div className="flex flex-wrap gap-2">
                {DAY_OPTIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={cn(
                      'h-11 min-w-[3rem] rounded-xl border text-sm font-semibold transition',
                      days === d
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : 'border-slate-200 bg-white hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </section>

            {/* Travelers */}
            <section>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4 text-sky-600" /> Travelers
              </label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11"
                  onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                >
                  −
                </Button>
                <span className="w-8 text-center text-lg font-bold">{travelers}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11"
                  onClick={() => setTravelers((t) => Math.min(12, t + 1))}
                >
                  +
                </Button>
              </div>
            </section>

            {/* Budget */}
            <section>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Wallet className="h-4 w-4 text-sky-600" /> Budget style
              </label>
              <div className="grid gap-2 sm:grid-cols-3">
                {BUDGET_OPTIONS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBudget(b.id)}
                    className={cn(
                      'rounded-xl border p-3 text-left transition',
                      budget === b.id
                        ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40'
                        : 'border-slate-200 hover:border-sky-300 dark:border-slate-700'
                    )}
                  >
                    <p className="font-semibold">{b.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{b.hint}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Pace */}
            <section>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4 text-sky-600" /> Pace
              </label>
              <div className="flex flex-wrap gap-2">
                {PACE_OPTIONS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPace(p.id)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-medium',
                      pace === p.id
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : 'border-slate-200 dark:border-slate-700'
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Interests */}
            <section>
              <label className="mb-2 block text-sm font-semibold">What do you care about?</label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((opt) => {
                  const on = interests.includes(opt.id)
                  const Icon = opt.icon
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleInterest(opt.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium',
                        on
                          ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200'
                          : 'border-slate-200 dark:border-slate-700'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Must-dos */}
            <section className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={includeBoat}
                  onChange={(e) => setIncludeBoat(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600"
                />
                Include Lake Tana boat / monasteries
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={includeFalls}
                  onChange={(e) => setIncludeFalls(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600"
                />
                Include Blue Nile Falls
              </label>
            </section>

            <Button size="lg" className="w-full sm:w-auto" onClick={generate}>
              <Sparkles className="h-4 w-4" /> Build my plan
            </Button>
            <p className="text-xs text-slate-400">
              Works offline with local Bahir Dar knowledge. Optional AI story after you generate.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {plan && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">{plan.title}</h2>
              <p className="text-sm text-slate-500">{plan.subtitle}</p>
              <p className="mt-1 text-xs text-slate-400">{totalStops} stops across {plan.days.length} day(s)</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setPlan(null)}>
                Edit choices
              </Button>
              <Button variant="outline" size="sm" onClick={copyPlan}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Budget strip */}
          <Card className="border-teal-100 bg-gradient-to-br from-teal-50 to-sky-50 dark:border-teal-900 dark:from-teal-950/40 dark:to-sky-950/40">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-teal-700 dark:text-teal-300">
                    Estimated budget
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {plan.budget.total.toLocaleString()} {plan.budget.currency}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    ~{plan.budget.perPerson.toLocaleString()} / person · ~{plan.budget.perDay.toLocaleString()} / day
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                  <span>Stay {plan.budget.lodging.toLocaleString()}</span>
                  <span>Food {plan.budget.food.toLocaleString()}</span>
                  <span>Transport {plan.budget.transport.toLocaleString()}</span>
                  <span>Activities {plan.budget.attraction.toLocaleString()}</span>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">{plan.budget.disclaimer}</p>
            </CardContent>
          </Card>

          {/* AI story */}
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">Trip story</p>
                {!story && (
                  <Button size="sm" variant="outline" disabled={storyLoading} onClick={loadStory}>
                    {storyLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    {storyLoading ? 'Writing…' : 'Generate with AI'}
                  </Button>
                )}
              </div>
              {story ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {story}
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Optional: turn this plan into a short friendly narrative (uses AI when configured, otherwise a
                  local summary).
                </p>
              )}
            </CardContent>
          </Card>

          {/* Days */}
          {plan.days.map((d) => (
            <Card key={d.dayNumber} className="overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
                  Day {d.dayNumber}
                </p>
                <h3 className="text-lg font-semibold">{d.title}</h3>
                <p className="text-sm text-slate-500">{d.summary}</p>
              </div>
              <CardContent className="space-y-3 p-4">
                {d.stops.map((s, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex w-14 shrink-0 flex-col items-center">
                      <span className="text-xs font-medium text-slate-400">{s.time || '—'}</span>
                      {i < d.stops.length - 1 && (
                        <div className="mt-1 w-px flex-1 bg-slate-200 dark:bg-slate-700" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pb-2">
                      <div className="flex flex-wrap items-baseline gap-2">
                        {s.placeSlug ? (
                          <Link
                            to={`/places/${s.placeSlug}`}
                            className="font-medium text-sky-700 hover:underline dark:text-sky-400"
                          >
                            {s.name}
                          </Link>
                        ) : (
                          <span className="font-medium">{s.name}</span>
                        )}
                        {s.estimatedCostEtb != null && s.estimatedCostEtb > 0 && (
                          <span className="text-xs text-teal-700 dark:text-teal-400">
                            ~{s.estimatedCostEtb} ETB
                          </span>
                        )}
                      </div>
                      {s.duration && (
                        <p className="text-xs text-slate-400">{s.duration}</p>
                      )}
                      {s.notes && <p className="mt-0.5 text-sm text-slate-500">{s.notes}</p>}
                    </div>
                  </div>
                ))}
                {(d.mealsTip || d.transportTip) && (
                  <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                    {d.mealsTip && <p>{d.mealsTip}</p>}
                    {d.transportTip && <p className="mt-0.5">{d.transportTip}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Tips */}
          <Card>
            <CardContent className="p-4">
              <p className="mb-2 text-sm font-semibold">Tips</p>
              <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                {plan.tips.map((t) => (
                  <li key={t} className="flex gap-2">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Next actions */}
          <div className="grid gap-2 sm:grid-cols-2">
            <Link to="/map">
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="h-4 w-4" /> Open map
              </Button>
            </Link>
            <Link to="/budget">
              <Button variant="outline" className="w-full justify-start">
                <Wallet className="h-4 w-4" /> Adjust budget
              </Button>
            </Link>
            <Link to="/trips">
              <Button variant="outline" className="w-full justify-start">
                <Route className="h-4 w-4" /> Ready-made trips
              </Button>
            </Link>
            <Link to="/ai-guide">
              <Button variant="outline" className="w-full justify-start">
                <Sparkles className="h-4 w-4" /> Ask AI guide
              </Button>
            </Link>
          </div>

          {plan.matchedGuideId && (
            <p className="text-center text-sm text-slate-500">
              Similar curated plan:{' '}
              <Link
                to={`/trips/${plan.matchedGuideId}`}
                className="font-medium text-sky-600 hover:underline"
              >
                View full guide →
              </Link>
            </p>
          )}

          <Button className="w-full" onClick={generate}>
            <Sparkles className="h-4 w-4" /> Regenerate plan
          </Button>
        </div>
      )}
    </div>
  )
}
