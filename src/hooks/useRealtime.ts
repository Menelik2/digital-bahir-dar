import { useEffect, useRef, useState } from 'react'
import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

export type RealtimeStatus = 'idle' | 'subscribing' | 'subscribed' | 'error' | 'closed'

export interface UseRealtimeOptions {
  /** Postgres schema (default public) */
  schema?: string
  /** Table name in public schema */
  table: string
  /** Filter e.g. place_id=eq.<uuid> */
  filter?: string
  /** Which events to listen for */
  event?: RealtimeEvent
  /** Query keys to invalidate when a change arrives */
  invalidateKeys?: QueryKey[]
  /** Optional custom handler (runs before invalidate) */
  onPayload?: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void
  /** Subscribe only when true (default true) */
  enabled?: boolean
  /** Channel name suffix for uniqueness */
  channelName?: string
}

/**
 * Subscribe to Supabase Postgres changes and refresh React Query caches.
 * Requires the table to be in the `supabase_realtime` publication (see migrations).
 */
export function useRealtimeSubscription(opts: UseRealtimeOptions) {
  const {
    schema = 'public',
    table,
    filter,
    event = '*',
    invalidateKeys = [],
    onPayload,
    enabled = true,
    channelName,
  } = opts

  const qc = useQueryClient()
  const [status, setStatus] = useState<RealtimeStatus>('idle')
  const [lastEventAt, setLastEventAt] = useState<number | null>(null)
  const onPayloadRef = useRef(onPayload)
  onPayloadRef.current = onPayload

  useEffect(() => {
    if (!enabled || !table) {
      setStatus('idle')
      return
    }

    setStatus('subscribing')
    const name =
      channelName ||
      `rt:${table}:${filter || 'all'}:${Math.random().toString(36).slice(2, 8)}`

    const channel: RealtimeChannel = supabase.channel(name)

    // supabase-js types require separate branches for event filters
    const config = {
      event: event as '*',
      schema,
      table,
      ...(filter ? { filter } : {}),
    } as const

    channel.on(
      'postgres_changes',
      config,
      (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
        setLastEventAt(Date.now())
        try {
          onPayloadRef.current?.(payload)
        } catch (e) {
          console.warn('realtime onPayload error', e)
        }
        for (const key of invalidateKeys) {
          void qc.invalidateQueries({ queryKey: key })
        }
      }
    )

    channel.subscribe((s) => {
      if (s === 'SUBSCRIBED') setStatus('subscribed')
      else if (s === 'CHANNEL_ERROR') setStatus('error')
      else if (s === 'CLOSED' || s === 'TIMED_OUT') setStatus('closed')
      else setStatus('subscribing')
    })

    return () => {
      setStatus('closed')
      void supabase.removeChannel(channel)
    }
    // invalidateKeys compared by JSON to avoid re-subscribe on new array identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, table, schema, filter, event, channelName, qc, JSON.stringify(invalidateKeys)])

  return { status, lastEventAt, isLive: status === 'subscribed' }
}

/** Convenience: multiple table subscriptions in one component */
export function useRealtimeMany(subs: UseRealtimeOptions[], enabled = true) {
  const results = subs.map((s, i) =>
    // Hooks in a loop need stable length — callers must pass fixed arrays
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRealtimeSubscription({ ...s, enabled: enabled && (s.enabled !== false), channelName: s.channelName || `many-${i}-${s.table}` })
  )
  const isLive = results.some((r) => r.isLive)
  const hasError = results.some((r) => r.status === 'error')
  return { isLive, hasError, results }
}
