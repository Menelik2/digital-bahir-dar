import { useState } from 'react'
import { Navigation, Loader2, MapPinOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGeolocation } from '@/hooks/useGeolocation'
import { formatAccuracy, geoErrorUserMessage, isInsideBahirDar, isNearBahirDar } from '@/services/geolocation'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/useT'

interface Props {
  className?: string
  onLocated?: (lat: number, lng: number) => void
}

export function LocationButton({ className, onLocated }: Props) {
  const t = useT()
  const { request, loading, hasFix, errorCode, insideBahirDar, getLastError } = useGeolocation(false)
  const { location, setMapCenter, setLocation } = useAppStore()
  const [hint, setHint] = useState<string | null>(null)

  const handleClick = async () => {
    setHint(null)
    try {
      const pos = await request()
      if (pos) {
        const near = isNearBahirDar(pos.latitude, pos.longitude, 50_000)
        const inside = isInsideBahirDar(pos.latitude, pos.longitude)
        if (!near) {
          // VPN / wrong country — do not pretend this is the user on the city map
          setLocation({
            latitude: null,
            longitude: null,
            accuracy: null,
            lastUpdated: null,
          })
          setHint(
            t.map.locationFar ||
              'GPS is far from Bahir Dar (VPN or wrong location?). Turn off VPN and allow precise location, then try again.'
          )
          window.setTimeout(() => setHint(null), 7000)
          return
        }
        setMapCenter({ lat: pos.latitude, lng: pos.longitude })
        onLocated?.(pos.latitude, pos.longitude)
        if (!inside) {
          setHint(
            t.map.locationOutside ||
              'Located near Bahir Dar — map shows the closest area on the city map'
          )
        } else {
          setHint((t.map.locationFound || 'You are here') + ` · ${formatAccuracy(pos.accuracy)}`)
        }
        window.setTimeout(() => setHint(null), 4000)
      } else {
        setHint(getLastError() || geoErrorUserMessage(errorCode) || geoErrorUserMessage(null))
        window.setTimeout(() => setHint(null), 5000)
      }
    } catch (e) {
      setHint(e instanceof Error ? e.message : geoErrorUserMessage(null))
      window.setTimeout(() => setHint(null), 5000)
    }
  }

  const denied = location.permission === 'denied' || errorCode === 'permission_denied'

  return (
    <div className="relative">
      <Button
        size="icon"
        variant="outline"
        className={cn(
          'h-11 w-11 shrink-0 rounded-xl border-black/[0.08] bg-white shadow-lg dark:border-white/12 dark:bg-[#1c1c1e]',
          hasFix && insideBahirDar && 'border-sky-400 ring-2 ring-sky-400/30',
          denied && 'border-rose-300',
          className
        )}
        onClick={() => void handleClick()}
        disabled={loading}
        title={
          denied
            ? t.map.locationDenied || 'Location denied — tap to retry'
            : t.map.myLocation || 'My location'
        }
        aria-label={t.map.myLocation || 'Use my location'}
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
        <div
          role="status"
          className="absolute right-0 top-12 z-[1100] w-56 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] leading-snug text-slate-700 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          {hint}
        </div>
      )}
    </div>
  )
}
