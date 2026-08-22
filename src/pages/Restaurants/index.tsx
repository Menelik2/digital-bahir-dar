import { Link } from 'react-router-dom'
import { MapPin, Utensils, Coffee, Fish, Leaf, AlertCircle } from 'lucide-react'
import { PlaceListPage } from '@/components/places/PlaceListPage'
import { Card, CardContent } from '@/components/ui/card'
import {
  LOCAL_RESTAURANT_PICKS,
  FOOD_NEIGHBORHOODS,
  FOOD_ETIQUETTE,
  FOOD_SAFETY,
} from '@/data/restaurants'

function RecommendationsBanner() {
  const featured = LOCAL_RESTAURANT_PICKS.filter((p) => p.featured)

  return (
    <div className="mx-auto max-w-6xl px-4 pb-2 pt-8">
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-amber-600 to-rose-600 px-5 py-8 text-white shadow-lg">
        <p className="text-sm font-medium text-orange-100">Local food guide</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          What to eat in Bahir Dar
        </h2>
        <p className="mt-2 max-w-2xl text-orange-50">
          Lake fish, injera houses, coffee culture, and budget kitchens — practical picks for
          visitors. Prices are estimates; confirm on site.
        </p>
      </div>

      <h3 className="mb-3 text-lg font-semibold">Neighborhoods</h3>
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {FOOD_NEIGHBORHOODS.map((n) => (
          <Card key={n.id}>
            <CardContent className="p-4">
              <p className="font-semibold">{n.title}</p>
              <p className="mt-1 text-sm text-slate-500">{n.blurb}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <Utensils className="h-5 w-5 text-orange-600" /> Recommended experiences
      </h3>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {featured.map((r) => (
          <Card key={r.id} className="overflow-hidden border-orange-100 dark:border-orange-950">
            <CardContent className="p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {r.tags.includes('fish') && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <Fish className="h-3 w-3" /> Fish
                  </span>
                )}
                {r.tags.includes('coffee') && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    <Coffee className="h-3 w-3" /> Coffee
                  </span>
                )}
                {r.tags.includes('vegetarian-friendly') && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <Leaf className="h-3 w-3" /> Veg-friendly
                  </span>
                )}
              </div>
              <h4 className="text-lg font-semibold">{r.name}</h4>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5" /> {r.area} · {r.cuisine}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{r.why}</p>
              <p className="mt-2 text-xs font-medium text-orange-700 dark:text-orange-300">
                {r.priceLabel}
              </p>
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Must try</p>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {r.mustTry.map((m) => (
                    <li
                      key={m}
                      className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs dark:bg-slate-800"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              {r.tip && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                  <strong>Tip:</strong> {r.tip}
                </p>
              )}
              {r.slug && (
                <Link
                  to={`/places/${r.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-sky-600 hover:underline"
                >
                  Open in app →
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h4 className="font-semibold">Etiquette</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
              {FOOD_ETIQUETTE.map((e) => (
                <li key={e} className="flex gap-2">
                  <span className="text-orange-500">·</span> {e}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h4 className="flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4 text-amber-600" /> Food safety
            </h4>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
              {FOOD_SAFETY.map((e) => (
                <li key={e} className="flex gap-2">
                  <span className="text-amber-500">·</span> {e}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <h3 className="mb-1 text-lg font-semibold">All picks</h3>
      <p className="mb-4 text-sm text-slate-500">
        More ideas below, then live listings from the app and OpenStreetMap.
      </p>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LOCAL_RESTAURANT_PICKS.filter((p) => !p.featured).map((r) => (
          <Card key={r.id}>
            <CardContent className="p-4">
              <p className="font-semibold">{r.name}</p>
              <p className="text-xs text-slate-500">
                {r.area} · {r.priceLabel}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{r.why}</p>
              {r.slug && (
                <Link to={`/places/${r.slug}`} className="mt-2 inline-block text-xs font-medium text-sky-600">
                  View place →
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function RestaurantsPage() {
  return (
    <>
      <RecommendationsBanner />
      <PlaceListPage
        title="Restaurants & cafés"
        subtitle="App listings + live OpenStreetMap food places in Bahir Dar"
        categorySlug="restaurant"
        osmCategories={['restaurant', 'cafe']}
        filters={[
          { id: 'traditional', label: 'Traditional Ethiopian' },
          { id: 'vegetarian', label: 'Vegetarian' },
        ]}
        emptyMessage="No restaurants in the database yet — use recommendations above or Discover for live map food places."
      />
    </>
  )
}
