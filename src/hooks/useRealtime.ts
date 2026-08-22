import { useEffect, useRef, useState } from 'react'
import type { QueryKey } from '@tanstack/react-query'
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
  extraTopics?: TopicSpec[]
  invalidateKeys?: QueryKey[]
  onPayload?: (payload: PostgresChangePayload) => void
  enabled?: boolean
}

/**
 * Shared, ref-counted Realtime subscription.
 * QueryClient is bound once in queryClient.ts — no per-hook setQueryClient.
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

  const [status, setStatus] = useState<RealtimeStatus>('idle')
  const [lastEventAt, setLastEventAt] = useState<number | null>(null)

  const onPayloadRef = useRef(onPayload)
  onPayloadRef.current = onPayload
  const keysRef = useRef(invalidateKeys)
  keysRef.current = invalidateKeys

  const keysSig = JSON.stringify(invalidateKeys ?? [])
  const extraSig = JSON.stringify(extraTopics ?? [])

  useEffect(() => {
    if (!enabled || !table) {
      setStatus('idle')
      return
    }

    const topics: TopicSpec[] = [{ schema, table, filter, event }, ...(extraTopics || [])]

    setStatus('subscribing')

    const unsub = realtimeHub.subscribe(topics, {
      // Snapshot keys at subscribe; effect re-runs when keysSig changes
      invalidateKeys: keysRef.current,
      onPayload: (payload) => {
        setLastEventAt(Date.now())
        onPayloadRef.current?.(payload)
      },
      onStatus: setStatus,
    })

    return unsub
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, table, schema, filter, event, extraSig, keysSig])

  return { status, lastEventAt, isLive: status === 'subscribed' }
}
