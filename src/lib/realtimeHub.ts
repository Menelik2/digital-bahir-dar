import type { QueryClient, QueryKey } from '@tanstack/react-query'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'
export type RealtimeStatus = 'idle' | 'subscribing' | 'subscribed' | 'error' | 'closed'

export type PostgresChangePayload = RealtimePostgresChangesPayload<Record<string, unknown>>

export interface TopicSpec {
  schema?: string
  table: string
  filter?: string
  event?: RealtimeEvent
}

type Listener = {
  id: string
  invalidateKeys: QueryKey[]
  onPayload?: (payload: PostgresChangePayload) => void
  onStatus?: (status: RealtimeStatus) => void
}

type TopicEntry = {
  key: string
  channel: RealtimeChannel
  status: RealtimeStatus
  listeners: Map<string, Listener>
  /** Tables bound on this channel (for multi-table channels) */
  topics: TopicSpec[]
}

function topicKey(t: TopicSpec): string {
  return `${t.schema || 'public'}|${t.table}|${t.filter || ''}|${t.event || '*'}`
}

function channelKey(topics: TopicSpec[]): string {
  return topics.map(topicKey).sort().join('||')
}

/** Debounce + coalesce React Query invalidations across all realtime events */
class InvalidateScheduler {
  private pending = new Map<string, QueryKey>()
  private timer: ReturnType<typeof setTimeout> | null = null
  private readonly delayMs: number

  constructor(
    private getClient: () => QueryClient | null,
    delayMs = 120
  ) {
    this.delayMs = delayMs
  }

  enqueue(keys: QueryKey[]) {
    for (const k of keys) {
      this.pending.set(JSON.stringify(k), k)
    }
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => this.flush(), this.delayMs)
  }

  flush() {
    this.timer = null
    const client = this.getClient()
    if (!client || this.pending.size === 0) {
      this.pending.clear()
      return
    }
    const keys = [...this.pending.values()]
    this.pending.clear()
    // Prefer prefix invalidation for short keys; exact for longer
    for (const key of keys) {
      void client.invalidateQueries({ queryKey: key })
    }
  }
}

/**
 * App-wide Realtime hub: one channel per unique topic set, ref-counted listeners,
 * debounced query invalidation. Avoids N duplicate websockets for the same table.
 */
class RealtimeHub {
  private entries = new Map<string, TopicEntry>()
  private queryClient: QueryClient | null = null
  private scheduler = new InvalidateScheduler(() => this.queryClient, 120)
  private listenerSeq = 0

  setQueryClient(qc: QueryClient) {
    this.queryClient = qc
  }

  /**
   * Subscribe to one or more postgres topics on a shared channel.
   * Returns an unsubscribe function.
   */
  subscribe(
    topics: TopicSpec[],
    opts: {
      invalidateKeys?: QueryKey[]
      onPayload?: (payload: PostgresChangePayload) => void
      onStatus?: (status: RealtimeStatus) => void
    } = {}
  ): () => void {
    const normalized = topics.map((t) => ({
      schema: t.schema || 'public',
      table: t.table,
      filter: t.filter,
      event: (t.event || '*') as RealtimeEvent,
    }))
    const key = channelKey(normalized)
    let entry = this.entries.get(key)

    if (!entry) {
      const name = `hub:${key.slice(0, 80)}`
      const channel = supabase.channel(name)
      entry = {
        key,
        channel,
        status: 'subscribing',
        listeners: new Map(),
        topics: normalized,
      }

      for (const t of normalized) {
        channel.on(
          'postgres_changes',
          {
            event: t.event as '*',
            schema: t.schema!,
            table: t.table,
            ...(t.filter ? { filter: t.filter } : {}),
          },
          (payload: PostgresChangePayload) => {
            this.dispatch(entry!, payload)
          }
        )
      }

      channel.subscribe((s) => {
        const st: RealtimeStatus =
          s === 'SUBSCRIBED'
            ? 'subscribed'
            : s === 'CHANNEL_ERROR'
              ? 'error'
              : s === 'CLOSED' || s === 'TIMED_OUT'
                ? 'closed'
                : 'subscribing'
        entry!.status = st
        for (const l of entry!.listeners.values()) {
          l.onStatus?.(st)
        }
      })

      this.entries.set(key, entry)
    }

    const id = `l${++this.listenerSeq}`
    const listener: Listener = {
      id,
      invalidateKeys: opts.invalidateKeys || [],
      onPayload: opts.onPayload,
      onStatus: opts.onStatus,
    }
    entry.listeners.set(id, listener)
    // Report current status immediately
    opts.onStatus?.(entry.status)

    return () => {
      const e = this.entries.get(key)
      if (!e) return
      e.listeners.delete(id)
      if (e.listeners.size === 0) {
        void supabase.removeChannel(e.channel)
        this.entries.delete(key)
      }
    }
  }

  private dispatch(entry: TopicEntry, payload: PostgresChangePayload) {
    const allKeys: QueryKey[] = []
    for (const l of entry.listeners.values()) {
      try {
        l.onPayload?.(payload)
      } catch (err) {
        console.warn('[realtimeHub] onPayload', err)
      }
      for (const k of l.invalidateKeys) allKeys.push(k)
    }
    if (allKeys.length) this.scheduler.enqueue(allKeys)
  }

  /** Debug / metrics */
  stats() {
    return {
      channels: this.entries.size,
      listeners: [...this.entries.values()].reduce((n, e) => n + e.listeners.size, 0),
    }
  }
}

export const realtimeHub = new RealtimeHub()
