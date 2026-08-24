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
import { TODAY_CLASSIC, PERIOD_LABEL, type TodayStep } from '@/data/todayInBahirDar'
import { cn } from '@/lib/utils'

const PERIOD_COLOR: Record<TodayStep['period'], string> = {
  morning: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  midday: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200',
  afternoon: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200',
  evening: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200',
}

function formatCost(step: TodayStep) {
  if (!step.costEtb) return null
  const { min, typical, max } = step.costEtb
  if (min === 0 && typical === 0) return 'Free'
  if (min === typical && typical === max) return `~${typical} ETB`
  return `~${typical} ETB (${min}–${max})`
}

export default function TodayPage() {
  const plan = TODAY_CLASSIC

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <Sun className="h-3.5 w-3.5" /> One day · clear plan
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{plan.title}</h1>
        <p className="mt-1 text-slate-500">{plan.subtitle}</p>
      </div>

      {/* Budget summary */}
      <Card className="mb-6 border-teal-100 bg-gradient-to-br from-teal-50 to-sky-50 dark:border-teal-900 dark:from-teal-950/40 dark:to-sky-950/40">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-teal-700 dark:text-teal-300">
              Rough day cost (1 person)
            </p>
            <p className="text-2xl font-bold">~{plan.totalEtbTypical.toLocaleString()} ETB</p>
            <p className="text-xs text-slate-500">Food + local hops + light activities · confirm on site</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/map">
              <Button size="sm" variant="outline">
                <MapPin className="h-3.5 w-3.5" /> Map
              </Button>
            </Link>
            <Link to="/trip-planner">
              <Button size="sm">
                <Sparkles className="h-3.5 w-3.5" /> Multi-day plan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <ol className="relative space-y-0 border-l-2 border-sky-200 pl-6 dark:border-sky-900">
        {plan.steps.map((step, i) => (
          <li key={step.id} className={cn('relative pb-8', i === plan.steps.length - 1 && 'pb-2')}>
            <span className="absolute -left-[1.9rem] flex h-6 w-6 items-center justify-center rounded-full border-2 border-sky-500 bg-white text-[10px] font-bold text-sky-700 dark:bg-slate-950">
              {i + 1}
            </span>
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                      PERIOD_COLOR[step.period]
                    )}
                  >
                    {PERIOD_LABEL[step.period]}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3" /> {step.time}
                  </span>
                  {step.duration && (
                    <span className="text-xs text-slate-400">{step.duration}</span>
                  )}
                </div>
                <h2 className="text-lg font-semibold">{step.title}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {step.costEtb && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-200">
                      <Wallet className="h-3 w-3" /> {formatCost(step)}
                    </span>
                  )}
                  {step.costNote && (
                    <span className="text-[11px] text-slate-400">{step.costNote}</span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {step.placeSlug && (
                    <Link to={`/places/${step.placeSlug}`}>
                      <Button size="sm" variant="outline">
                        <MapPin className="h-3.5 w-3.5" /> Place details
                      </Button>
                    </Link>
                  )}
                  <Link to="/map">
                    <Button size="sm" variant="ghost">
                      <Navigation className="h-3.5 w-3.5" /> Open map
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>

      {/* Optional second day */}
      <Link to={plan.optionalExtra.href} className="mb-6 block">
        <Card className="border-dashed border-sky-300 transition hover:border-sky-500 dark:border-sky-800">
          <CardContent className="flex items-start gap-3 p-4">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
            <div>
              <p className="font-semibold">{plan.optionalExtra.title}</p>
              <p className="text-sm text-slate-500">{plan.optionalExtra.body}</p>
              <p className="mt-1 text-sm font-medium text-sky-600">Open AI Trip Planner →</p>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Tips */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <p className="mb-2 text-sm font-semibold">Quick tips</p>
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            {plan.tips.map((tip) => (
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
            <ListTodo className="h-4 w-4" /> Checklist
          </Button>
        </Link>
        <Link to="/trips">
          <Button variant="outline" className="w-full justify-start">
            <Route className="h-4 w-4" /> More plans
          </Button>
        </Link>
        <Link to="/spend-guide">
          <Button variant="outline" className="w-full justify-start">
            <Wallet className="h-4 w-4" /> Food prices
          </Button>
        </Link>
      </div>
    </div>
  )
}
