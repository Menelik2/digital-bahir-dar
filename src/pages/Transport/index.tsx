import { Link } from 'react-router-dom'
import { Bus, ExternalLink } from 'lucide-react'
import { PlaceListPage } from '@/components/places/PlaceListPage'
import { GUIDE_SITES, categoryGuideSearch } from '@/constants/guideSites'
import { TRANSPORT_FARES } from '@/data/cityLife'
import { Card, CardContent } from '@/components/ui/card'

export default function TransportPage() {
  const maps = categoryGuideSearch('bus station taxi Bahir Dar')

  return (
    <div>
      <PlaceListPage
        title="Transport"
        subtitle="Bus stops, taxi points, airport & ferry terminals from OpenStreetMap"
        categorySlug="transport"
        osmCategories={['transport']}
        emptyMessage="No transport POIs loaded. See fares below or open Google Maps."
      />

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="mb-3 text-lg font-semibold">Typical fares (estimates)</h2>
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {TRANSPORT_FARES.map((f) => (
            <Card key={f.id}>
              <CardContent className="flex gap-3 p-4">
                <Bus className="h-5 w-5 shrink-0 text-sky-600" />
                <div>
                  <p className="font-medium">{f.title}</p>
                  <p className="text-sm text-slate-500">{f.detail}</p>
                  <p className="mt-1 text-sm font-semibold text-teal-700 dark:text-teal-400">{f.priceLabel}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="mb-3 text-lg font-semibold">Find routes online</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={maps.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
          >
            <ExternalLink className="h-4 w-4 text-sky-600" /> Google Maps transport
          </a>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
          >
            Live OSM transport
          </Link>
          {GUIDE_SITES.filter((s) => s.categories.includes('transport')).map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
            >
              {s.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
