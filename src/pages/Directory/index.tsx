import { Link } from 'react-router-dom'
import {
  Hotel, UtensilsCrossed, Landmark, Building2, CreditCard, Car,
  Hospital, Pill, ShoppingBag, Calendar, AlertTriangle, Coffee, Map,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const sections = [
  { label: 'Hotels', icon: Hotel, path: '/hotels', color: 'bg-blue-50 text-blue-600' },
  { label: 'Restaurants', icon: UtensilsCrossed, path: '/restaurants', color: 'bg-orange-50 text-orange-600' },
  { label: 'Cafes', icon: Coffee, path: '/explore', color: 'bg-amber-50 text-amber-700' },
  { label: 'Attractions', icon: Landmark, path: '/attractions', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Banks', icon: Building2, path: '/banks', color: 'bg-indigo-50 text-indigo-600' },
  { label: 'ATMs', icon: CreditCard, path: '/banks', color: 'bg-cyan-50 text-cyan-600' },
  { label: 'Transport', icon: Car, path: '/transport', color: 'bg-violet-50 text-violet-600' },
  { label: 'Hospitals', icon: Hospital, path: '/directory', color: 'bg-red-50 text-red-600' },
  { label: 'Pharmacies', icon: Pill, path: '/directory', color: 'bg-green-50 text-green-600' },
  { label: 'Shopping', icon: ShoppingBag, path: '/explore', color: 'bg-pink-50 text-pink-600' },
  { label: 'Events', icon: Calendar, path: '/events', color: 'bg-purple-50 text-purple-600' },
  { label: 'Emergency', icon: AlertTriangle, path: '/directory', color: 'bg-rose-50 text-rose-600' },
  { label: 'Map', icon: Map, path: '/map', color: 'bg-sky-50 text-sky-600' },
]

export default function DirectoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Bahir Dar Directory</h1>
      <p className="mb-8 text-slate-500">Browse city services and places by category</p>
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
    </div>
  )
}
