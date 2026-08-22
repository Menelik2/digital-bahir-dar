import { Link } from 'react-router-dom'
import {
  Map,
  Car,
  Hotel,
  Shield,
  Calendar,
  Sparkles,
  ListTodo,
  Compass,
  Building2,
  Phone,
} from 'lucide-react'
import { SMART_CITY_MODULES, CITY_TODOS } from '@/data/thingsToDo'
import { EMERGENCY_CONTACTS, CITY_EVENTS } from '@/data/cityLife'
import { useTodoStore } from '@/store/todoStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const ICONS = {
  map: Map,
  car: Car,
  hotel: Hotel,
  shield: Shield,
  calendar: Calendar,
  sparkles: Sparkles,
} as const

export default function CityHubPage() {
  const completed = useTodoStore((s) => s.completed)
  const done = CITY_TODOS.filter((t) => completed[t.id]).length
  const featuredEvents = CITY_EVENTS.filter((e) => e.featured).slice(0, 2)
  const critical = EMERGENCY_CONTACTS.filter((c) => c.priority === 'critical')

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-sky-900 to-teal-800 px-6 py-10 text-white shadow-lg">
        <p className="text-sm font-medium text-sky-200">Digital Bahir Dar</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Smart Digital City</h1>
        <p className="mt-3 max-w-2xl text-sky-100">
          One platform for tourism, mobility, hospitality, civic info, and planning — built for Bahir
          Dar, Ethiopia.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/todo">
            <Button className="bg-white text-sky-900 hover:bg-sky-50">
              <ListTodo className="h-4 w-4" /> Things to Do ({done}/{CITY_TODOS.length})
            </Button>
          </Link>
          <Link to="/discover">
            <Button variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
              <Compass className="h-4 w-4" /> Live Discover
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
              <Map className="h-4 w-4" /> City map
            </Button>
          </Link>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold">City modules</h2>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SMART_CITY_MODULES.map((m) => {
          const Icon = ICONS[m.icon]
          return (
            <Link key={m.id} to={m.href}>
              <Card className="h-full transition hover:border-sky-300 hover:shadow-md dark:hover:border-sky-700">
                <CardContent className="flex gap-3 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{m.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{m.body}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Emergency</h2>
            <Link to="/directory" className="text-sm text-sky-600 hover:underline">
              Full directory
            </Link>
          </div>
          <div className="space-y-2">
            {critical.map((c) => (
              <Card key={c.id}>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-rose-500" />
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.role}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="rounded-lg bg-rose-50 px-3 py-1.5 text-sm font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-200"
                  >
                    {c.phone}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">This week in the city</h2>
            <Link to="/events" className="text-sm text-sky-600 hover:underline">
              Events
            </Link>
          </div>
          <div className="space-y-2">
            {featuredEvents.map((e) => (
              <Link key={e.id} to="/events">
                <Card className="mb-2 transition hover:shadow-md">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-sky-600">{e.dateLabel}</p>
                    <p className="font-semibold">{e.title}</p>
                    <p className="line-clamp-2 text-sm text-slate-500">{e.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
            <Link
              to="/banks"
              className="flex items-center gap-2 text-sm font-medium text-sky-600 hover:underline"
            >
              <Building2 className="h-4 w-4" /> Banks & ATMs
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
