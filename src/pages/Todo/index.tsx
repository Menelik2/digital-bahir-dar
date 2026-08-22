import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, ListTodo, RotateCcw, ArrowRight, Sparkles } from 'lucide-react'
import { CITY_TODOS, PILLAR_LABEL, type TodoPillar } from '@/data/thingsToDo'
import { useTodoStore } from '@/store/todoStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const ALL: TodoPillar | 'all' = 'all'

export default function TodoPage() {
  const { completed, toggle, reset } = useTodoStore()
  const [pillar, setPillar] = useState<TodoPillar | 'all'>('all')

  const total = CITY_TODOS.length
  const done = CITY_TODOS.filter((t) => completed[t.id]).length
  const pct = Math.round((done / total) * 100)

  const list = useMemo(() => {
    let items = [...CITY_TODOS].sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title))
    if (pillar !== 'all') items = items.filter((t) => t.pillar === pillar)
    return items
  }, [pillar])

  const pillars = Object.keys(PILLAR_LABEL) as TodoPillar[]

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <ListTodo className="h-3.5 w-3.5" /> Bahir Dar Smart City
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">Things to Do</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            A practical checklist for visitors and residents — explore, stay, eat, move, and stay safe.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={reset} title="Reset checklist">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>

      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">
              {done} / {total} completed
            </span>
            <span className="text-slate-500">{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/city">
              <Button size="sm" variant="secondary">
                Smart City hub
              </Button>
            </Link>
            <Link to="/ai-guide">
              <Button size="sm" variant="outline">
                <Sparkles className="h-4 w-4" /> AI itinerary help
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setPillar(ALL)}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
            pillar === 'all'
              ? 'border-sky-500 bg-sky-500 text-white'
              : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
          )}
        >
          All
        </button>
        {pillars.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPillar(p)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
              pillar === p
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
            )}
          >
            {PILLAR_LABEL[p].en}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {list.map((item) => {
          const isDone = !!completed[item.id]
          const pill = PILLAR_LABEL[item.pillar]
          return (
            <li key={item.id}>
              <Card
                className={cn(
                  'transition',
                  isDone && 'opacity-75 ring-1 ring-emerald-200 dark:ring-emerald-900'
                )}
              >
                <CardContent className="flex gap-3 p-4">
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className="mt-0.5 shrink-0 text-sky-600"
                    aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-slate-300" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h2
                        className={cn(
                          'font-semibold',
                          isDone && 'text-slate-500 line-through'
                        )}
                      >
                        {item.title}
                      </h2>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', pill.color)}>
                        {pill.en}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                      <span>{item.timeLabel}</span>
                      <span>{item.costLabel}</span>
                    </div>
                    {item.tips && (
                      <p className="mt-2 text-xs text-amber-800 dark:text-amber-200/90">💡 {item.tips}</p>
                    )}
                    <Link
                      to={item.href}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-sky-600 hover:underline"
                    >
                      Open in app <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
