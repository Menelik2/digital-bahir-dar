import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Crosshair, Loader2, MapPin, Navigation, Hotel, UtensilsCrossed, Landmark, Building2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGeolocation } from '@/hooks/useGeolocation'
import { formatAccuracy, distanceToBahirDarCenter } from '@/services/geolocation'
import { formatDistance } from '@/utils/geo'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  onLocated?: (lat: number, lng: number) => void
  onNearFilter?: (filter: string) => void
}

/** Compact “where am I?” helper — collapses to a small chip so the map stays visible. */
export function WhereAmIPanel({ className, onLocated, onNearFilter }: Props) {
  const lang = useAppStore((s) => s.language)
  const am = lang === 'am'
  const { location, setMapCenter } = useAppStore()
  const { request, loading, hasFix, insideBahirDar, nearBahirDar } = useGeolocation(false)
  const [collapsed, setCollapsed] = useState(false)

  const showMe = async () => {
    try {
      const pos = await request()
      if (pos) {
        setMapCenter({ lat: pos.latitude, lng: pos.longitude })
        onLocated?.(pos.latitude, pos.longitude)
      }
    } catch {
      /* handled elsewhere */
    }
  }

  // No GPS yet
  if (!hasFix || location.latitude == null || location.longitude == null) {
    if (collapsed) {
      return (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          title={am ? 'ቦታዎን ያሳዩ' : 'Show your location'}
          aria-label={am ? 'ቦታዎን ያሳዩ' : 'Show your location'}
          className={cn(
            'pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/95 py-2 pl-2 pr-3 shadow-lg backdrop-blur-xl dark:border-white/12 dark:bg-[#1c1c1e]/95',
            className
          )}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b6e99]/15 text-[#0b6e99]">
            <Crosshair className="h-3.5 w-3.5" />
          </span>
          <span className="text-[12px] font-semibold text-[#1c1c1e] dark:text-white">
            {am ? 'ቦታ' : 'Locate'}
          </span>
        </button>
      )
    }
    return (
      <div
        className={cn(
          'pointer-events-auto max-w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl border border-black/[0.06] bg-white/95 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/95',
          className
        )}
      >
        <div className="flex gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0b6e99]/15 text-[#0b6e99]">
            <Crosshair className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[14px] font-bold tracking-tight text-[#1c1c1e] dark:text-white">
                {am ? 'አሁን የት ነዎት?' : 'Where are you?'}
              </p>
              <button
                type="button"
                className="rounded-full p-0.5 text-[#8e8e93] hover:bg-black/5 dark:hover:bg-white/10"
                onClick={() => setCollapsed(true)}
                aria-label={am ? 'ዝጋ' : 'Close'}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-0.5 text-[12px] leading-snug text-[#8e8e93]">
              {am ? 'ሰማያዊ ነጥብ በካርታው ላይ።' : 'A blue dot shows you on the map.'}
            </p>
            <Button
              className="mt-2 h-9 w-full rounded-full bg-[#078930] text-[13px] font-semibold hover:bg-[#056b24]"
              onClick={() => void showMe()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> {am ? 'እየፈለገ…' : 'Finding…'}
                </>
              ) : (
                <>
                  <Navigation className="h-3.5 w-3.5" /> {am ? 'ቦታዬን አሳይ' : 'Show my location'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const dist = distanceToBahirDarCenter(location.latitude, location.longitude)
  const placeLabel = insideBahirDar
    ? am
      ? 'ባሕር ዳር'
      : 'Bahir Dar'
    : nearBahirDar
      ? am
        ? formatDistance(dist)
        : formatDistance(dist)
      : am
        ? formatDistance(dist)
        : formatDistance(dist)

  const shortcuts = [
    { id: 'hotel', label: am ? 'ሆቴል' : 'Hotels', icon: Hotel },
    { id: 'restaurant', label: am ? 'ምግብ' : 'Food', icon: UtensilsCrossed },
    { id: 'attraction', label: am ? 'መስህብ' : 'Sights', icon: Landmark },
    { id: 'bank', label: am ? 'ባንክ' : 'Banks', icon: Building2 },
  ]

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        title={am ? 'እዚህ ነዎት' : 'You are here'}
        aria-label={am ? 'እዚህ ነዎት' : 'You are here'}
        className={cn(
          'pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-white/95 py-2 pl-2 pr-3 shadow-lg backdrop-blur-xl dark:border-emerald-800/50 dark:bg-[#1c1c1e]/95',
          className
        )}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#078930] text-white">
          <MapPin className="h-3.5 w-3.5" />
        </span>
        <span className="max-w-[9rem] truncate text-[12px] font-semibold text-[#1c1c1e] dark:text-white">
          {placeLabel}
        </span>
      </button>
    )
  }

  return (
    <div
      className={cn(
        'pointer-events-auto max-w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-emerald-200/80 bg-white/95 p-3 shadow-xl backdrop-blur-xl dark:border-emerald-800/50 dark:bg-[#1c1c1e]/95',
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#078930] text-white shadow-sm">
          <MapPin className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[14px] font-bold text-[#1c1c1e] dark:text-white">
                {am ? 'እዚህ ነዎት' : 'You are here'}
              </p>
              <p className="text-[12px] text-[#078930] dark:text-[#30d158]">{placeLabel}</p>
              <p className="mt-0.5 text-[11px] text-[#8e8e93]">
                {formatAccuracy(location.accuracy)}
              </p>
            </div>
            <button
              type="button"
              className="rounded-full p-0.5 text-[#8e8e93] hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setCollapsed(true)}
              aria-label={am ? 'ዝጋ' : 'Close'}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="h-8 rounded-full text-[11px]"
              onClick={() => void showMe()}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : am ? 'አድስ' : 'Refresh'}
            </Button>
            {shortcuts.map((s) => {
              const Icon = s.icon
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onNearFilter?.(s.id)}
                  className="inline-flex items-center gap-1 rounded-full bg-[#f2f2f7] px-2.5 py-1.5 text-[11px] font-semibold text-[#1c1c1e] transition active:scale-95 dark:bg-white/10 dark:text-white"
                >
                  <Icon className="h-3 w-3 text-[#078930]" />
                  {s.label}
                </button>
              )
            })}
            <Link
              to="/help"
              className="inline-flex items-center rounded-full bg-[#0b6e99]/12 px-2.5 py-1.5 text-[11px] font-semibold text-[#0b6e99] dark:text-[#5ac8fa]"
            >
              {am ? 'እርዳታ' : 'Help'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
