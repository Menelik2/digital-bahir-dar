import { useState } from 'react'
import { Navigation, Loader2, MapPinOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGeolocation } from '@/hooks/useGeolocation'
import { formatAccuracy, geoErrorUserMessage } from '@/services/geolocation'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  onLocated?: (lat: number, lng: number) => void
}

export function LocationButton({ className, onLocated }: Props) {
  const { request, loading, hasFix, error, errorCode, insideBahirDar } = useGeolocation(false)
  const { location, setMapCenter } = useAppStore()
  const [hint, setHint] = useState<string | null>(null)

  const handleClick = async () => {
    setHint(null)
    const pos = await request()
    if (pos) {
      setMapCenter({ lat: pos.latitude, lng: pos.longitude })
      onLocated?.(pos.latitude, pos.longitude)
      if (!isInsideHint(pos.latitude, pos.longitude)) {
        setHint('Location found — outside Bahir Dar city bounds')
      } else {
        setHint(`Located · ${formatAccuracy(pos.accuracy)}`)
      }
      window.setTimeout(() => setHint(null), 3500)
    } else {
      setHint(error || geoErrorUserMessage(errorCode))
      window.setTimeout(() => setHint(null), 4500)
    }
  }

  const denied = location.permission === 'denied' || errorCode === 'permission_denied'

  return (
    <div className="relative">
      <Button
        size="icon"
        variant="outline"
        className={cn(
          'h-11 w-11 rounded-xl bg-white shadow-lg dark:bg-slate-900',
          hasFix && insideBahirDar && 'border-sky-400',
          denied && 'border-rose-300',
          className
        )}
        onClick={() => void handleClick()}
        disabled={loading}
        title={denied ? 'Location denied — tap to retry' : 'My location'}
        aria-label="Use my location"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
        ) : denied ? (
          <MapPinOff className="h-5 w-5 text-rose-500" />
        ) : (
          <Navigation className={cn('h-5 w-5', hasFix && 'text-sky-600')} />
        )}
      </Button>
      {hint && (
        <div className="absolute right-0 top-12 z-[1100] w-56 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] leading-snug text-slate-700 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {hint}
        </div>
      )}
    </div>
  )
}

function isInsideHint(lat: number, lng: number) {
  // Local import avoided circular — use simple bbox matching map constants
  return lat >= 11.52 && lat <= 11.66 && lng >= 37.3 && lng <= 37.48
}
