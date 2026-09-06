import { cn } from '@/lib/utils'
import { useT } from '@/hooks/useT'

const FILTER_IDS = [
  'near_me',
  'verified',
  'hotel',
  'restaurant',
  'attraction',
  'bank',
  'atm',
  'taxi',
  'hospital',
] as const

interface Props {
  active: string | null
  onChange: (id: string | null) => void
  className?: string
}

/** Horizontal filter chips — iPhone Maps / Explore style */
export function MapFilter({ active, onChange, className }: Props) {
  const t = useT()
  const labels: Record<(typeof FILTER_IDS)[number], string> = {
    near_me: t.map.filterNearMe,
    verified: t.map.filterVerified,
    hotel: t.map.filterHotel,
    restaurant: t.map.filterFood,
    attraction: t.map.filterAttraction,
    bank: t.map.filterBank,
    atm: t.map.filterAtm,
    taxi: t.map.filterTaxi,
    hospital: t.map.filterHospital,
  }

  return (
    <div
      className={cn('mobile-chips gap-2', className)}
      role="toolbar"
      aria-label="Map filters"
    >
      {FILTER_IDS.map((id) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(isActive ? null : id)}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-2.5 text-[13px] font-semibold shadow-md transition active:scale-[0.97]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#078930]/45 focus-visible:ring-offset-2',
              isActive
                ? 'bg-[#078930] text-white shadow-[#078930]/30'
                : 'border border-black/[0.08] bg-white/95 text-[#1c1c1e] backdrop-blur-md dark:border-white/12 dark:bg-[#1c1c1e]/95 dark:text-white'
            )}
          >
            {labels[id]}
          </button>
        )
      })}
    </div>
  )
}
