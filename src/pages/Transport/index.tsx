import { Link } from 'react-router-dom'
import { Car, Info, Map as MapIcon } from 'lucide-react'
import { PlaceListPage } from '@/components/places/PlaceListPage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TRANSPORT_FARES } from '@/data/cityLife'

export default function TransportPage() {
  return (
    <div>
      <div className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
                <Car className="h-7 w-7 text-violet-600" /> Transport & fares
              </h1>
              <p className="mt-1 max-w-2xl text-slate-500">
                Bajaj, taxi, minibus, boats, and day-trip estimates. Prices are approximate ETB ranges — always agree before you ride.
              </p>
            </div>
            <Link to="/map">
              <Button variant="outline" size="sm">
                <MapIcon className="h-4 w-4" /> Open map
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mode</th>
                  <th className="px-4 py-3 font-semibold">Route</th>
                  <th className="px-4 py-3 font-semibold">Est. price</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {TRANSPORT_FARES.map((f) => (
                  <tr key={f.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-4 py-3 font-medium">{f.mode}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{f.route}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-sky-700 dark:text-sky-400">
                        {f.priceMin}–{f.priceMax}
                      </span>{' '}
                      <span className="text-xs text-slate-500">{f.unit}</span>
                      {!f.verified && (
                        <span className="ml-1 text-xs text-amber-600">est.</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{f.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Card className="mt-4 border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20">
            <CardContent className="flex gap-3 p-4 text-sm text-amber-950 dark:text-amber-100">
              <Info className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Price tips</p>
                <ul className="mt-1 list-inside list-disc text-amber-900/90 dark:text-amber-100/90">
                  <li>Agree the fare in ETB before the trip starts.</li>
                  <li>Night, rain, and luggage can increase prices.</li>
                  <li>Hotel-arranged airport and Falls transfers reduce haggling stress.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PlaceListPage
        title="Transport providers"
        subtitle="Listings from the directory — estimates unless marked verified"
        categorySlug="transport"
        emptyMessage="No transport providers listed yet. Use the fare table above and ask your hotel for verified operators."
      />
    </div>
  )
}
