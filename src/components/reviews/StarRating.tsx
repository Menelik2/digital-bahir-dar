import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  value: number
  onChange?: (v: number) => void
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  className?: string
}

const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-7 w-7' }

export function StarRating({ value, onChange, size = 'md', readonly, className }: Props) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} role={readonly ? 'img' : 'group'} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly || !onChange}
          onClick={() => onChange?.(n)}
          className={cn(
            'rounded p-0.5 transition',
            !readonly && onChange && 'hover:scale-110 cursor-pointer',
            (readonly || !onChange) && 'cursor-default'
          )}
          aria-label={`${n} stars`}
        >
          <Star
            className={cn(
              sizes[size],
              n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
            )}
          />
        </button>
      ))}
    </div>
  )
}
