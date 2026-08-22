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

export function MapFilter({ active, onChange, className }: Props) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-1 scrollbar-none', className)}>
      {FILTERS.map((f) => {
        const isActive = active === f.id
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(isActive ? null : f.id)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-sm font-medium shadow-md transition',
              isActive
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
            )}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
