import { Link } from 'react-router-dom'
import { Languages, Star, BadgeCheck, Phone, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TOUR_GUIDES } from '@/data/cityLife'

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Tour guides</h1>
          <p className="max-w-2xl text-slate-500">
            Local guides for Lake Tana, Blue Nile Falls, and city culture. Rates are estimates in ETB — confirm before booking.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/ai-guide">
            <Button variant="outline" size="sm">
              <Sparkles className="h-4 w-4" /> Ask AI Guide
            </Button>
          </Link>
          <Link to="/business">
            <Button size="sm">List as a guide</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TOUR_GUIDES.map((g) => (
          <Card key={g.id} className="flex flex-col">
            <CardContent className="flex flex-1 flex-col p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{g.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-sm text-amber-600">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="font-medium">{g.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({g.reviewCount})</span>
                  </div>
                </div>
                {g.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    DEMO
                  </span>
                )}
              </div>

              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{g.bio}</p>

              <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-500">
                <Languages className="h-3.5 w-3.5" />
                {g.languages.join(' · ')}
              </div>

              <div className="mb-3 flex flex-wrap gap-1.5">
                {g.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-950/40 dark:text-sky-200"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-auto space-y-2 border-t border-slate-100 pt-3 text-sm dark:border-slate-800">
                <p>
                  <span className="text-slate-500">Experience:</span>{' '}
                  <span className="font-medium">{g.yearsExperience} years</span>
                </p>
                <p>
                  <span className="text-slate-500">Day rate (est.):</span>{' '}
                  <span className="font-medium">
                    {g.dayRateEtb.min.toLocaleString()} – {g.dayRateEtb.max.toLocaleString()} ETB
                  </span>
                </p>
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="h-3.5 w-3.5" /> {g.phoneHint}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
        <h2 className="mb-2 font-semibold">How to book safely</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <li>Prefer guides recommended by your hotel or a licensed tour office.</li>
          <li>Agree itinerary, group size, language, and total price in ETB before leaving.</li>
          <li>For boats, confirm operator, islands, and return time in writing if possible.</li>
          <li>Guides can register and claim profiles via the Business portal for verification.</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/trips">
            <Button variant="outline" size="sm">
              Plan a trip
            </Button>
          </Link>
          <Link to="/attractions">
            <Button variant="outline" size="sm">
              Attractions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
