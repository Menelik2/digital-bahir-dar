import { cn } from '@/lib/utils'
import type { RealtimeStatus } from '@/hooks/useRealtime'

export function LiveBadge({
  status,
  className,
  label = 'Live',
}: {
  status: RealtimeStatus | boolean
  className?: string
  label?: string
}) {
  const isLive = typeof status === 'boolean' ? status : status === 'subscribed'
  const isError = typeof status === 'string' && status === 'error'
  const isConnecting =
    typeof status === 'string' && (status === 'subscribing' || status === 'idle')

  if (!isLive && !isError && !isConnecting) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium',
        isLive && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
        isError && 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
        isConnecting && 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        className
      )}
      title={isLive ? 'Real-time updates active' : isError ? 'Real-time connection error' : 'Connecting…'}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          isLive && 'animate-pulse bg-emerald-500',
          isError && 'bg-rose-500',
          isConnecting && 'bg-slate-400'
        )}
      />
      {isLive ? label : isError ? 'Offline' : '…'}
    </span>
  )
}
