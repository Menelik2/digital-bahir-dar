import { Link } from 'react-router-dom'
import {
  Hotel,
  UtensilsCrossed,
  Landmark,
  Building2,
  CreditCard,
  Car,
  Hospital,
  Pill,
  ShoppingBag,
  Calendar,
  AlertTriangle,
  Coffee,
  Map,
  Users,
  Phone,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { EMERGENCY_CONTACTS, PRACTICAL_TIPS } from '@/data/cityLife'

const sections = [
  { label: 'Hotels', icon: Hotel, path: '/hotels', color: 'bg-blue-50 text-blue-600' },
  { label: 'Restaurants', icon: UtensilsCrossed, path: '/restaurants', color: 'bg-orange-50 text-orange-600' },
  { label: 'Cafes', icon: Coffee, path: '/explore', color: 'bg-amber-50 text-amber-700' },
  { label: 'Attractions', icon: Landmark, path: '/attractions', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Banks', icon: Building2, path: '/banks', color: 'bg-indigo-50 text-indigo-600' },
  { label: 'ATMs', icon: CreditCard, path: '/banks', color: 'bg-cyan-50 text-cyan-600' },
  { label: 'Transport', icon: Car, path: '/transport', color: 'bg-violet-50 text-violet-600' },
  { label: 'Tour guides', icon: Users, path: '/guides', color: 'bg-teal-50 text-teal-600' },
  { label: 'Events', icon: Calendar, path: '/events', color: 'bg-purple-50 text-purple-600' },
  { label: 'Shopping', icon: ShoppingBag, path: '/explore', color: 'bg-pink-50 text-pink-600' },
  { label: 'Map', icon: Map, path: '/map', color: 'bg-sky-50 text-sky-600' },
  { label: 'Hospitals', icon: Hospital, path: '/directory#emergency', color: 'bg-red-50 text-red-600' },
  { label: 'Pharmacies', icon: Pill, path: '/directory#emergency', color: 'bg-green-50 text-green-600' },
  { label: 'Emergency', icon: AlertTriangle, path: '/directory#emergency', color: 'bg-rose-50 text-rose-600' },
]

export default function DirectoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Bahir Dar Directory</h1>
      <p className="mb-8 text-slate-500">Browse city services, places, and emergency contacts</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {sections.map((s) => (
          <Link key={s.label} to={s.path}>
            <Card className="transition hover:shadow-md active:scale-[0.98]">
              <CardContent className="flex flex-col items-center gap-2 p-5 text-center">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{s.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <section id="emergency" className="mt-12 scroll-mt-24">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold">
          <AlertTriangle className="h-5 w-5 text-rose-600" /> Emergency & help
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          National numbers where applicable. For hospitals and clinics, ask your hotel for the current recommended facility.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EMERGENCY_CONTACTS.map((c) => (
            <Card
              key={c.id}
              className={
                c.priority === 'critical'
                  ? 'border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/20'
                  : ''
              }
            >
              <CardContent className="p-4">
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-slate-500">{c.role}</p>
                <p className="mt-2 flex items-center gap-2 text-lg font-bold text-sky-700 dark:text-sky-400">
                  <Phone className="h-4 w-4" />
                  {c.phone.startsWith('9') || c.phone.match(/^\d/) ? (
                    <a href={`tel:${c.phone}`} className="hover:underline">
                      {c.phone}
                    </a>
                  ) : (
                    c.phone
                  )}
                </p>
                {c.hours && <p className="mt-1 text-xs text-slate-500">{c.hours}</p>}
                {c.address && <p className="text-xs text-slate-500">{c.address}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Practical tips</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRACTICAL_TIPS.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-4">
                <h3 className="font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
