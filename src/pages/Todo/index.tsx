import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, ListTodo, RotateCcw, ArrowRight, Lightbulb } from 'lucide-react'
import { CITY_TODOS, PILLAR_LABEL, type TodoPillar } from '@/data/thingsToDo'
import { useTodoStore } from '@/store/todoStore'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function TodoPage() {
  const { completed, toggle, reset } = useTodoStore()
  const lang = useAppStore((s) => s.language)
  const am = lang === 'am'
  const [pillar, setPillar] = useState<TodoPillar | 'all'>('all')

  const total = CITY_TODOS.length
  const done = CITY_TODOS.filter((t) => completed[t.id]).length
  const pct = total ? Math.round((done / total) * 100) : 0

  const list = useMemo(() => {
    let items = [...CITY_TODOS].sort((a, b) => a.priority - b.priority)
    if (pillar !== 'all') items = items.filter((t) => t.pillar === pillar)
    return items
  }, [pillar])

  const pillars = Object.keys(PILLAR_LABEL) as TodoPillar[]

  return (
    <div className="mx-auto max-w-3xl bg-[#f2f2f7] px-4 py-8 dark:bg-black">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#0b6e99]/12 px-3 py-1 text-xs font-semibold text-[#0b6e99] dark:bg-[#0b6e99]/25 dark:text-[#7dd3fc]">
            <ListTodo className="h-3.5 w-3.5" />
            {am ? 'ባሕር ዳር — ለጎብኝዎች' : 'Bahir Dar — for visitors'}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-3xl">
            {am ? 'ለማድረግ የሚገቡ ነገሮች' : 'Things to Do'}
          </h1>
          <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-[#8e8e93]">
            {am
              ? 'እውነተኛ የባሕር ዳር ዝርዝር — ሐይቅ፣ ፏፏቴ፣ ምግብ፣ ባጃጅ፣ ገንዘብ እና ደህንነት። ምልክት ያድርጉ ሲጨርሱ።'
              : 'A real Bahir Dar checklist — lake, falls, food, bajaj, money, and safety. Tick items as you go.'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => {
            if (window.confirm(am ? 'ሁሉንም ምልክቶች ዳግም ማስጀመር?' : 'Reset all checkmarks?')) reset()
          }}
          title={am ? 'ዳግም አስጀምር' : 'Reset checklist'}
        >
          <RotateCcw className="h-4 w-4" /> {am ? 'ዳግም' : 'Reset'}
        </Button>
      </div>

      <Card className="mb-6 overflow-hidden border-black/[0.06] shadow-sm dark:border-white/10">
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-[#1c1c1e] dark:text-white">
              {am ? `${done} / ${total} ተጠናቋል` : `${done} / ${total} completed`}
            </span>
            <span className="text-[#8e8e93]">{pct}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#078930] to-[#0b6e99] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {done === total && total > 0 && (
            <p className="mt-2 text-[13px] font-medium text-[#078930] dark:text-[#30d158]">
              {am ? 'እንኳን ደስ አለዎት — ዋናዎቹን ጨርሰዋል!' : 'Well done — you’ve covered the essentials!'}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setPillar('all')}
          className={cn(
            'shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition',
            pillar === 'all'
              ? 'bg-[#078930] text-white'
              : 'bg-white text-[#1c1c1e] ring-1 ring-black/[0.06] dark:bg-[#1c1c1e] dark:text-white dark:ring-white/10'
          )}
        >
          {am ? 'ሁሉም' : 'All'}
        </button>
        {pillars.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPillar(p)}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition',
              pillar === p
                ? 'bg-[#078930] text-white'
                : 'bg-white text-[#1c1c1e] ring-1 ring-black/[0.06] dark:bg-[#1c1c1e] dark:text-white dark:ring-white/10'
            )}
          >
            {am ? PILLAR_LABEL[p].am : PILLAR_LABEL[p].en}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {list.map((item) => {
          const isDone = !!completed[item.id]
          const title = am ? item.titleAm : item.title
          const body = am ? item.descriptionAm : item.description
          const tip = am ? item.tipAm : item.tip
          const time = am ? item.timeLabelAm : item.timeLabel
          const cost = am ? item.costLabelAm : item.costLabel
          const pillarLabel = am ? PILLAR_LABEL[item.pillar].am : PILLAR_LABEL[item.pillar].en

          return (
            <li key={item.id}>
              <Card
                className={cn(
                  'border-black/[0.06] shadow-sm transition dark:border-white/10',
                  isDone && 'opacity-75'
                )}
              >
                <CardContent className="p-0">
                  <div className="flex gap-0">
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      className="flex shrink-0 items-start px-3 pt-4"
                      aria-label={isDone ? (am ? 'እንደገና ክፈት' : 'Mark incomplete') : am ? 'ተጠናቋል' : 'Mark done'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-7 w-7 text-[#078930]" />
                      ) : (
                        <Circle className="h-7 w-7 text-[#c7c7cc]" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1 py-4 pr-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#f2f2f7] px-2 py-0.5 text-[11px] font-semibold text-[#8e8e93] dark:bg-white/10">
                          {pillarLabel}
                        </span>
                        <span className="text-[11px] text-[#8e8e93]">{time}</span>
                        <span className="text-[11px] font-medium text-[#078930] dark:text-[#30d158]">{cost}</span>
                      </div>
                      <h2
                        className={cn(
                          'mt-1 text-[16px] font-semibold leading-snug text-[#1c1c1e] dark:text-white',
                          isDone && 'line-through opacity-70'
                        )}
                      >
                        {title}
                      </h2>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#8e8e93]">{body}</p>
                      {tip && (
                        <p className="mt-2 flex gap-1.5 text-[12px] leading-snug text-[#0b6e99] dark:text-[#7dd3fc]">
                          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>{tip}</span>
                        </p>
                      )}
                      {item.href && (
                        <Link
                          to={item.href}
                          className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#078930] dark:text-[#30d158]"
                        >
                          {am ? 'ክፈት' : 'Open'} <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>

      {list.length === 0 && (
        <p className="py-12 text-center text-[#8e8e93]">{am ? 'በዚህ ምድብ ምንም የለም' : 'Nothing in this category'}</p>
      )}

      <div className="mt-10 rounded-2xl bg-gradient-to-br from-[#0b6e99]/15 to-[#078930]/15 p-5 dark:from-[#0b6e99]/25 dark:to-[#078930]/20">
        <p className="text-[16px] font-bold text-[#1c1c1e] dark:text-white">
          {am ? 'ቀጣይ እርምጃ?' : 'Next step?'}
        </p>
        <p className="mt-1 text-[13px] text-[#8e8e93]">
          {am
            ? 'የዛሬ እቅድ፣ ካርታ ወይም AI መመሪያ — ከተማውን በቀላሉ ይጀምሩ።'
            : 'Open Today’s plan, the map, or the AI guide to start exploring.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/today">
            <Button className="h-10 rounded-full bg-[#078930] hover:bg-[#056b24]">
              {am ? 'ዛሬ' : 'Today'}
            </Button>
          </Link>
          <Link to="/map?locate=1">
            <Button variant="outline" className="h-10 rounded-full">
              {am ? 'ካርታ' : 'Map'}
            </Button>
          </Link>
          <Link to="/help">
            <Button variant="outline" className="h-10 rounded-full">
              {am ? 'እርዳታ' : 'Help'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
