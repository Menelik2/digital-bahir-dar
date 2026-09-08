import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Crosshair, Loader2, MapPin, Navigation, Hotel, UtensilsCrossed, Landmark, Building2 } from 'lucide-react'
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

/** Clear “where am I?” panel for visitors who don’t know the city. */
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

  if (!hasFix || location.latitude == null || location.longitude == null) {
    return (
      <div
        className={cn(
          'pointer-events-auto rounded-2xl border border-black/[0.06] bg-white/95 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/95',
          className
        )}
      >
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0b6e99]/15 text-[#0b6e99]">
            <Crosshair className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-bold tracking-tight text-[#1c1c1e] dark:text-white">
              {am ? 'አሁን የት ነዎት?' : 'Where are you now?'}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-[#8e8e93]">
              {am
                ? 'ከተማውን ካላወቁ — ቦታዎን አንዴ ይክፈቱ። ካርታው ሰማያዊ ነጥብ ያሳያል።'
                : 'New in town? Turn on location once. A blue dot shows you on the map.'}
            </p>
            <Button
              className="mt-3 h-11 w-full rounded-full bg-[#078930] text-[15px] font-semibold hover:bg-[#056b24] sm:w-auto sm:px-6"
              onClick={() => void showMe()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {am ? 'እየፈለገ…' : 'Finding…'}
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4" /> {am ? 'ቦታዬን አሳይ' : 'Show my location'}
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
      ? 'ባሕር ዳር ውስጥ ነዎት'
      : 'You are in Bahir Dar'
    : nearBahirDar
      ? am
        ? `ከማዕከሉ ${formatDistance(dist)}`
        : `${formatDistance(dist)} from city center`
      : am
        ? `ከባሕር ዳር ${formatDistance(dist)}`
        : `${formatDistance(dist)} from Bahir Dar`

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
        className={cn(
          'pointer-events-auto flex w-full items-center gap-2 rounded-full border border-emerald-200/80 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-xl dark:border-emerald-800/50 dark:bg-[#1c1c1e]/95',
          className
        )}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#078930] text-white">
          <MapPin className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1 truncate text-left text-[13px] font-semibold text-[#1c1c1e] dark:text-white">
          {am ? 'እዚህ ነዎት' : 'You are here'} · {placeLabel}
        </span>
        <span className="text-[11px] font-medium text-[#078930]">{am ? 'ክፈት' : 'Open'}</span>
      </button>
    )
  }

  return (
    <div
      className={cn(
        'pointer-events-auto rounded-2xl border border-emerald-200/80 bg-white/95 p-3 shadow-xl backdrop-blur-xl dark:border-emerald-800/50 dark:bg-[#1c1c1e]/95 sm:p-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#078930] text-white shadow-sm">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-[#1c1c1e] dark:text-white">
            {am ? 'እዚህ ነዎት' : 'You are here'}
          </p>
          <p className="text-[13px] text-[#078930] dark:text-[#30d158]">{placeLabel}</p>
          <p className="mt-0.5 text-[11px] text-[#8e8e93]">
            {formatAccuracy(location.accuracy)}
            {am ? ' · ሰማያዊ ነጥብ = እርስዎ' : ' · Blue dot = you'}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-full text-[11px]"
            onClick={() => void showMe()}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : am ? 'አድስ' : 'Refresh'}
          </Button>
          <button
            type="button"
            className="text-[11px] font-medium text-[#8e8e93] underline"
            onClick={() => setCollapsed(true)}
          >
            {am ? 'ደብቅ' : 'Hide'}
          </button>
        </div>
      </div>

      <p className="mt-3 text-[12px] font-semibold text-[#8e8e93]">
        {am ? 'በአቅራቢያ ይፈልጉ' : 'Find near you'}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {shortcuts.map((s) => {
          const Icon = s.icon
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onNearFilter?.(s.id)}
              className="inline-flex items-center gap-1 rounded-full bg-[#f2f2f7] px-3 py-1.5 text-[12px] font-semibold text-[#1c1c1e] transition active:scale-95 dark:bg-white/10 dark:text-white"
            >
              <Icon className="h-3.5 w-3.5 text-[#078930]" />
              {s.label}
            </button>
          )
        })}
        <Link
          to="/help"
          className="inline-flex items-center rounded-full bg-[#0b6e99]/12 px-3 py-1.5 text-[12px] font-semibold text-[#0b6e99] dark:text-[#5ac8fa]"
        >
          {am ? 'እርዳታ' : 'Help'}
        </Link>
      </div>
    </div>
  )
}
