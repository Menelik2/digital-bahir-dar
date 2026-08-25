import type { ReactNode } from 'react'
import { Loader2, AlertCircle, MapPin, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Variant = 'loading' | 'error' | 'empty'

interface StateMessageProps {
  variant: Variant
  title?: string
  body?: string
  onRetry?: () => void
  retryLabel?: string
  action?: ReactNode
  className?: string
}

const icons = {
  loading: Loader2,
  error: AlertCircle,
  empty: Inbox,
} as const

export function StateMessage({
  variant,
  title,
  body,
  onRetry,
  retryLabel = 'Retry',
  action,
  className,
}: StateMessageProps) {
  const Icon = variant === 'empty' ? MapPin : icons[variant]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-4 py-16 text-center',
        className
      )}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'loading' ? 'polite' : undefined}
    >
      <Icon
        className={cn(
          'mb-3 h-10 w-10',
          variant === 'loading' && 'animate-spin text-sky-500',
          variant === 'error' && 'text-red-500',
          variant === 'empty' && 'text-slate-300 dark:text-slate-600'
        )}
      />
      {title && (
        <p
          className={cn(
            'font-medium',
            variant === 'empty'
              ? 'text-slate-700 dark:text-slate-300'
              : 'text-slate-800 dark:text-slate-100'
          )}
        >
          {title}
        </p>
      )}
      {body && <p className="mt-1 max-w-sm text-sm text-slate-500">{body}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
