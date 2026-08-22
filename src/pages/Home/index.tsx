import { Link } from 'react-router-dom'
import {
  MapPin,
  Hotel,
  UtensilsCrossed,
  Landmark,
  Car,
  Building2,
  CreditCard,
  Coffee,
  ShoppingBag,
  Hospital,
  Calendar,
  AlertTriangle,
  Sparkles,
  Navigation,
  Users,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { APP_TAGLINE } from '@/constants'
import { CITY_EVENTS, PRACTICAL_TIPS } from '@/data/cityLife'

const quickActions = [
  { label: 'Hotels', icon: Hotel, path: '/hotels', color: 'bg-blue-50 text-blue-600' },
  { label: 'Restaurants', icon: UtensilsCrossed, path: '/restaurants', color: 'bg-orange-50 text-orange-600' },
  { label: 'Attractions', icon: Landmark, path: '/attractions', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Transport', icon: Car, path: '/transport', color: 'bg-violet-50 text-violet-600' },
  { label: 'Banks', icon: Building2, path: '/banks', color: 'bg-indigo-50 text-indigo-600' },
  { label: 'ATMs', icon: CreditCard, path: '/banks', color: 'bg-cyan-50 text-cyan-600' },
  { label: 'Guides', icon: Users, path: '/guides', color: 'bg-teal-50 text-teal-600' },
  { label: 'Cafes', icon: Coffee, path: '/explore', color: 'bg-amber-50 text-amber-700' },
  { label: 'Shopping', icon: ShoppingBag, path: '/directory', color: 'bg-pink-50 text-pink-600' },
  { label: 'Events', icon: Calendar, path: '/events', color: 'bg-purple-50 text-purple-600' },
  { label: 'Budget', icon: Wallet, path: '/budget', color: 'bg-lime-50 text-lime-700' },
  { label: 'Emergency', icon: AlertTriangle, path: '/directory#emergency', color: 'bg-rose-50 text-rose-600' },
]

export default function HomePage() {
  const upcoming = CITY_EVENTS.filter((e) => e.featured).slice(0, 3)
  const tips = PRACTICAL_TIPS.slice(0, 3)

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-sky-500 to-teal-600 px-4 py-16 text-white sm:py-24">
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
            <MapPin className="h-4 w-4" /> Bahir Dar, Ethiopia 🇪🇹
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Discover Bahir Dar</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-sky-100 sm:text-xl">{APP_TAGLINE}</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/map">
              <Button size="lg" className="w-full bg-white text-sky-700 hover:bg-sky-50 sm:w-auto">
                <Navigation className="h-5 w-5" /> Explore Map
              </Button>
            </Link>
            <Link to="/trips">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
              >
                Plan My Trip
              </Button>
            </Link>
            <Link to="/ai-guide">
              <Button size="lg" variant="ghost" className="w-full text-white hover:bg-white/15 sm:w-auto">
                <Sparkles className="h-5 w-5" /> AI Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 text-xl font-semibold">What do you need?</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.path}>
              <Card className="transition hover:shadow-md active:scale-[0.98]">
                <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${a.color}`}>
                    <a.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{a.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-10 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Happening around town</h2>
            <Link to="/events" className="text-sm font-medium text-sky-600 hover:underline">
              All events
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {upcoming.map((e) => (
              <Link key={e.id} to="/events">
                <Card className="h-full transition hover:shadow-md">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-sky-600">{e.dateLabel}</p>
                    <h3 className="mt-1 font-semibold">{e.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{e.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 text-xl font-semibold">Featured experiences</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/attractions">
            <Card className="overflow-hidden transition hover:shadow-lg">
              <div className="h-40 bg-gradient-to-br from-sky-400 to-blue-600" />
              <CardContent className="p-4">
                <h3 className="font-semibold">Lake Tana</h3>
                <p className="text-sm text-slate-500">Ethiopia's largest lake & monasteries</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/attractions">
            <Card className="overflow-hidden transition hover:shadow-lg">
              <div className="h-40 bg-gradient-to-br from-emerald-400 to-teal-600" />
              <CardContent className="p-4">
                <h3 className="font-semibold">Blue Nile Falls</h3>
                <p className="text-sm text-slate-500">Tissisat — the smoking water</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/guides">
            <Card className="overflow-hidden transition hover:shadow-lg">
              <div className="h-40 bg-gradient-to-br from-amber-400 to-orange-500" />
              <CardContent className="p-4">
                <h3 className="font-semibold">Local guides</h3>
                <p className="text-sm text-slate-500">Licensed help for boats, Falls & city</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-4 py-10 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Travel smart</h2>
            <Link to="/directory" className="text-sm font-medium text-sky-600 hover:underline">
              Full directory
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {tips.map((t) => (
              <Card key={t.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{t.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to="/transport">
              <Button variant="outline" size="sm">
                <Car className="h-4 w-4" /> Fares
              </Button>
            </Link>
            <Link to="/directory#emergency">
              <Button variant="outline" size="sm">
                <Hospital className="h-4 w-4" /> Emergency
              </Button>
            </Link>
            <Link to="/budget">
              <Button variant="outline" size="sm">
                <Wallet className="h-4 w-4" /> Budget
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="mb-3 text-2xl font-bold">Ready to explore?</h2>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          GPS map, AI guide, trips, budgets, events, and local services — built for Bahir Dar.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/map">
            <Button size="lg">
              <MapPin className="h-5 w-5" /> Open Map
            </Button>
          </Link>
          <Link to="/ai-guide">
            <Button size="lg" variant="outline">
              <Sparkles className="h-5 w-5" /> AI Guide
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
