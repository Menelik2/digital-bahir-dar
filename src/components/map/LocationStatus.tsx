import { MapPin, Crosshair } from 'lucide-react'
import { useGeolocation } from '@/hooks/useGeolocation'
import { formatAccuracy } from '@/services/geolocation'
import { formatDistance } from '@/utils/geo'
import { distanceToBahirDarCenter } from '@/services/geolocation'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

/** Compact status chip for map / explore headers */
export function LocationStatus({ className }: { className?: string }) {
  const lang = useAppStore((s) => s.language)
  const am = lang === 'am'
  const { location, hasFix, insideBahirDar, nearBahirDar, loading, watching } = useGeolocation(false)

  if (loading) {
    return (
      <span className={cn('text-[11px] text-slate-500', className)}>
        {am ? 'ቦታ እየተገኘ…' : 'Getting location…'}
      </span>
    )
  }

  if (!hasFix || location.latitude == null || location.longitude == null) {
    return (
      <span className={cn('inline-flex items-center gap-1 text-[11px] text-slate-500', className)}>
        <Crosshair className="h-3 w-3" /> {am ? 'ቦታ ጠፍቷል' : 'Location off'}
      </span>
    )
  }

  const dist = distanceToBahirDarCenter(location.latitude, location.longitude)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium shadow-sm dark:bg-slate-900/90',
        insideBahirDar ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-200',
        className
      )}
    >
      <MapPin className="h-3 w-3" />
      {insideBahirDar
        ? am
          ? `ባሕር ዳር · ${formatAccuracy(location.accuracy)}`
          : `In Bahir Dar · ${formatAccuracy(location.accuracy)}`
        : nearBahirDar
          ? am
            ? `ከማዕከሉ ${formatDistance(dist)}`
            : `${formatDistance(dist)} from center`
          : am
            ? `ከባሕር ዳር ${formatDistance(dist)}`
            : `${formatDistance(dist)} from Bahir Dar`}
      {watching ? (am ? ' · ቀጥታ' : ' · live') : ''}
    </span>
  )
}
