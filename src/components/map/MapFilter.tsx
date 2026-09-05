import { cn } from '@/lib/utils'

const FILTERS = [
  { id: 'near_me', label: 'Near Me' },
  { id: 'verified', label: 'Verified' },
  { id: 'hotel', label: 'Hotels' },
  { id: 'restaurant', label: 'Food' },
  { id: 'attraction', label: 'Attractions' },
  { id: 'bank', label: 'Banks' },
  { id: 'atm', label: 'ATM' },
  { id: 'taxi', label: 'Taxi' },
  { id: 'hospital', label: 'Hospital' },
] as const

interface Props {
  active: string | null
  onChange: (id: string | null) => void
  className?: string
}

/** Horizontal filter chips — iPhone Maps / Explore style */
export function MapFilter({ active, onChange, className }: Props) {
  return (
    <div className={cn('mobile-chips gap-2', className)}>
      {FILTERS.map((f) => {
        const isActive = active === f.id
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(isActive ? null : f.id)}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-2.5 text-[13px] font-semibold shadow-md transition active:scale-[0.97]',
              isActive
                ? 'bg-[#078930] text-white shadow-[#078930]/30'
                : 'border border-black/[0.08] bg-white/95 text-[#1c1c1e] backdrop-blur-md dark:border-white/12 dark:bg-[#1c1c1e]/95 dark:text-white'
            )}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
