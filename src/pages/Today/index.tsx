import { Link } from 'react-router-dom'
import {
  Sun,
  MapPin,
  Wallet,
  Clock,
  ChevronRight,
  Sparkles,
  Navigation,
  Route,
  ListTodo,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TODAY_CLASSIC, type TodayStep } from '@/data/todayInBahirDar'
import { useT, useLang } from '@/hooks/useT'
import { cn } from '@/lib/utils'

const PERIOD_COLOR: Record<TodayStep['period'], string> = {
  morning: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  midday: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200',
  afternoon: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200',
  evening: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200',
}

export default function TodayPage() {
  const t = useT()
  const { isAm } = useLang()
  const plan = TODAY_CLASSIC

  const periodLabel: Record<TodayStep['period'], string> = {
    morning: t.today.morning,
    midday: t.today.midday,
    afternoon: t.today.afternoon,
    evening: t.today.evening,
  }

  function stepTitle(step: TodayStep) {
    return isAm ? step.titleAm : step.title
  }

  function stepDescription(step: TodayStep) {
    return isAm ? step.descriptionAm : step.description
  }

  function stepDuration(step: TodayStep) {
    if (!step.duration) return null
    return isAm && step.durationAm ? step.durationAm : step.duration
  }

  function stepCostNote(step: TodayStep) {
    if (!step.costNote) return null
    return isAm && step.costNoteAm ? step.costNoteAm : step.costNote
  }

  function formatCost(step: TodayStep) {
    if (!step.costEtb) return null
    const { min, typical, max } = step.costEtb
    if (min === 0 && typical === 0) return t.today.free
    if (min === typical && typical === max) return `~${typical} ብር`
    // Keep ETB symbol readable in both languages
    const unit = isAm ? 'ብር' : 'ETB'
    if (min === typical && typical === max) return `~${typical} ${unit}`
    return `~${typical} ${unit} (${min}–${max})`
  }

  const tips = isAm ? plan.tipsAm : plan.tips
  const extraTitle = isAm ? plan.optionalExtra.titleAm : plan.optionalExtra.title
  const extraBody = isAm ? plan.optionalExtra.bodyAm : plan.optionalExtra.body

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <Sun className="h-3.5 w-3.5" /> {t.today.badge}
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{t.today.title}</h1>
        <p className="mt-1 text-slate-500">{t.today.subtitle}</p>
      </div>

      <Card className="mb-6 border-teal-100 bg-gradient-to-br from-teal-50 to-sky-50 dark:border-teal-900 dark:from-teal-950/40 dark:to-sky-950/40">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-teal-700 dark:text-teal-300">
              {t.today.dayCost}
            </p>
            <p className="text-2xl font-bold">
              ~{plan.totalEtbTypical.toLocaleString()} {isAm ? 'ብር' : 'ETB'}
            </p>
            <p className="text-xs text-slate-500">{t.today.dayCostHint}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/map">
              <Button variant="outline" size="sm" className="rounded-full">
                <MapPin className="h-4 w-4" /> {t.today.map}
              </Button>
            </Link>
            <Link to="/trip-planner">
              <Button size="sm" className="rounded-full">
                <Sparkles className="h-4 w-4" /> {t.today.multiDay}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <ol className="relative mb-8 border-s border-slate-200 ps-6 dark:border-slate-700">
        {plan.steps.map((step, i) => (
          <li key={step.id} className={cn('relative pb-8', i === plan.steps.length - 1 && 'pb-2')}>
            <span className="absolute -start-[25px] flex h-4 w-4 items-center justify-center rounded-full border border-white bg-[#078930] ring-4 ring-white dark:border-slate-900 dark:ring-black" />
            <Card className="border-black/[0.04] shadow-sm dark:border-white/[0.08]">
              <CardContent className="p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                      PERIOD_COLOR[step.period]
                    )}
                  >
                    {periodLabel[step.period]}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" /> {step.time}
                  </span>
                  {stepDuration(step) && (
                    <span className="text-xs text-slate-400">{stepDuration(step)}</span>
                  )}
                </div>
                <h2 className="text-lg font-semibold">{stepTitle(step)}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{stepDescription(step)}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {step.costEtb && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <Wallet className="h-3 w-3" /> {formatCost(step)}
                    </span>
                  )}
                  {stepCostNote(step) && (
                    <span className="text-[11px] text-slate-400">{stepCostNote(step)}</span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {step.placeSlug && (
                    <Link to={`/places/${step.placeSlug}`}>
                      <Button variant="outline" size="sm" className="rounded-full">
                        <MapPin className="h-3.5 w-3.5" /> {t.today.placeDetails}
                      </Button>
                    </Link>
                  )}
                  <Link to="/map">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Navigation className="h-3.5 w-3.5" /> {t.today.openMap}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>

      <Link to={plan.optionalExtra.href} className="mb-6 block">
        <Card className="border-dashed border-sky-200 bg-sky-50/80 transition hover:border-sky-300 dark:border-sky-900 dark:bg-sky-950/30">
          <CardContent className="flex items-start gap-3 p-4">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sky-900 dark:text-sky-100">{extraTitle}</p>
              <p className="mt-0.5 text-sm text-sky-800/80 dark:text-sky-200/80">{extraBody}</p>
              <p className="mt-2 text-sm font-semibold text-sky-700 dark:text-sky-300">
                {t.today.openPlanner}
              </p>
            </div>
            <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-sky-500" />
          </CardContent>
        </Card>
      </Link>

      <Card className="mb-6">
        <CardContent className="p-4">
          <p className="mb-2 text-sm font-semibold">{t.today.quickTips}</p>
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-2 sm:grid-cols-3">
        <Link to="/todo">
          <Button variant="outline" className="w-full justify-start">
            <ListTodo className="h-4 w-4" /> {t.today.checklist}
          </Button>
        </Link>
        <Link to="/trips">
          <Button variant="outline" className="w-full justify-start">
            <Route className="h-4 w-4" /> {t.today.morePlans}
          </Button>
        </Link>
        <Link to="/spend-guide">
          <Button variant="outline" className="w-full justify-start">
            <Wallet className="h-4 w-4" /> {t.today.foodPrices}
          </Button>
        </Link>
      </div>
    </div>
  )
}
