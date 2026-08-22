import { ExternalLink } from 'lucide-react'
import { MAPCARTA_BAHIR_DAR } from '@/constants/guideSites'
import { Button } from '@/components/ui/button'

interface MapcartaEmbedProps {
  className?: string
  /** Optional title override */
  title?: string
}

/**
 * Embedded Mapcarta view for Bahir Dar.
 * Mapcarta has no public tile API — we embed their city page for POI discovery.
 */
export function MapcartaEmbed({ className, title = 'Mapcarta — Bahir Dar' }: MapcartaEmbedProps) {
  return (
    <div className={className ?? 'relative h-full w-full bg-slate-100 dark:bg-slate-900'}>
      <iframe
        title={title}
        src={MAPCARTA_BAHIR_DAR}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        allow="geolocation; fullscreen"
      />
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex justify-center sm:justify-start">
        <a
          href={MAPCARTA_BAHIR_DAR}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto"
        >
          <Button size="sm" variant="secondary" className="shadow-lg">
            <ExternalLink className="h-3.5 w-3.5" /> Open full Mapcarta
          </Button>
        </a>
      </div>
    </div>
  )
}
