import { useEffect, useRef, useState } from 'react'
import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import {
  realtimeHub,
  type RealtimeEvent,
  type RealtimeStatus,
  type TopicSpec,
  type PostgresChangePayload,
} from '@/lib/realtimeHub'

export type { RealtimeEvent, RealtimeStatus, PostgresChangePayload }

export interface UseRealtimeOptions {
  schema?: string
  table: string
  filter?: string
  event?: RealtimeEvent
  /** Extra tables on the same shared channel (e.g. trip_days + trip_stops) */
  extraTopics?: TopicSpec[]
  invalidateKeys?: QueryKey[]
  onPayload?: (payload: PostgresChangePayload) => void
  enabled?: boolean
}

/**
 * Shared, ref-counted Realtime subscription.
 * Multiple components listening to the same table+filter share one channel.
 * Invalidations are debounced (~120ms) and coalesced.
 */
export function useRealtimeSubscription(opts: UseRealtimeOptions) {
  const {
    schema = 'public',
    table,
    filter,
    event = '*',
    extraTopics,
    invalidateKeys,
    onPayload,
    enabled = true,
  } = opts

  const qc = useQueryClient()
  const [status, setStatus] = useState<RealtimeStatus>('idle')
  const [lastEventAt, setLastEventAt] = useState<number | null>(null)

  const onPayloadRef = useRef(onPayload)
  onPayloadRef.current = onPayload
  const keysRef = useRef(invalidateKeys)
  keysRef.current = invalidateKeys

  // Stable key string for effect deps (avoid resubscribe on new array identity)
  const keysSig = JSON.stringify(invalidateKeys ?? [])
  const extraSig = JSON.stringify(extraTopics ?? [])

  useEffect(() => {
    realtimeHub.setQueryClient(qc)
  }, [qc])

  useEffect(() => {
    if (!enabled || !table) {
      setStatus('idle')
      return
    }

    const topics: TopicSpec[] = [
      { schema, table, filter, event },
      ...(extraTopics || []),
    ]

    setStatus('subscribing')

    const unsub = realtimeHub.subscribe(topics, {
      invalidateKeys: keysRef.current,
      onPayload: (payload) => {
        setLastEventAt(Date.now())
        onPayloadRef.current?.(payload)
      },
      onStatus: setStatus,
    })

    return unsub
    // keysSig/extraSig stand in for array identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, table, schema, filter, event, extraSig, keysSig, qc])

  return { status, lastEventAt, isLive: status === 'subscribed' }
}
