import { ExternalLink, Map as MapIcon } from 'lucide-react'
import { MAPCARTA_BAHIR_DAR, openMapcarta } from '@/constants/guideSites'
import { Button } from '@/components/ui/button'

interface Props {
  className?: string
  onUseAppMap?: () => void
}

/**
 * Mapcarta refuses iframe embedding (X-Frame-Options / CSP).
 * There is no public Mapcarta tile or embed API.
 * Mapcarta itself is built on OpenStreetMap — our in-app Leaflet map uses that same data.
 */
export function MapcartaPanel({ className, onUseAppMap }: Props) {
  return (
    <div
      className={
        className ??
        'flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-teal-50 px-6 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900'
      }
    >
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          <MapIcon className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mapcarta opens in a new tab</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          mapcarta.com blocks embedding inside other apps. Use the <strong>in-app map</strong> (OpenStreetMap
          data — the same source Mapcarta uses) or open Mapcarta fully in your browser.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button className="w-full sm:w-auto" onClick={() => openMapcarta()}>
            <ExternalLink className="h-4 w-4" /> Open Mapcarta
          </Button>
          {onUseAppMap && (
            <Button variant="outline" className="w-full sm:w-auto" onClick={onUseAppMap}>
              Back to app map
            </Button>
          )}
        </div>
        <a
          href={MAPCARTA_BAHIR_DAR}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-xs text-sky-600 hover:underline"
        >
          {MAPCARTA_BAHIR_DAR}
        </a>
      </div>
    </div>
  )
}

export function MapcartaEmbed(props: Props) {
  return <MapcartaPanel {...props} />
}
