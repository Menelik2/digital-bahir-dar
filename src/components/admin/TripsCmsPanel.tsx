import { useMemo, useState } from 'react'
import {
  Loader2, Pencil, Plus, Trash2, CalendarDays, Search, Download, Eye, EyeOff, Archive,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useAdminTrips, useAdminTripDetail, useAdminActions } from '@/hooks/useAdmin'
import { downloadCsv } from '@/services/admin'
import type { TripStatus } from '@/types/trip'
import { cn } from '@/lib/utils'

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    planning: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    completed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    archived: 'bg-slate-200 text-slate-500 dark:bg-slate-700',
  }
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide', styles[status] ?? 'bg-slate-100 text-slate-600')}>
      {status}
    </span>
  )
}

export function TripsCmsPanel() {
  const { user } = useAuth()
  const { data: trips = [], isLoading, refetch } = useAdminTrips(true)
  const actions = useAdminActions()
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TripStatus>('all')
  const [banner, setBanner] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandId, setExpandId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [travelers, setTravelers] = useState('2')
  const [budget, setBudget] = useState('')
  const [status, setStatus] = useState<TripStatus>('planning')
  const [isPublic, setIsPublic] = useState(false)

  const [newStopName, setNewStopName] = useState('')
  const [newStopDayId, setNewStopDayId] = useState<string | null>(null)

  const { data: detail, isLoading: detailLoading, refetch: refetchDetail } = useAdminTripDetail(expandId)

  const flash = (msg: string) => {
    setBanner(msg)
    window.setTimeout(() => setBanner(null), 3500)
  }
  const run = async (fn: () => Promise<unknown>, okMsg?: string) => {
    try {
      await fn()
      if (okMsg) flash(okMsg)
      refetch()
      if (expandId) refetchDetail()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Action failed — check RLS / staff role')
    }
  }

  const filtered = useMemo(() => {
    let list = trips
    if (statusFilter !== 'all') list = list.filter((t) => t.status === statusFilter)
    const needle = q.trim().toLowerCase()
    if (needle) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(needle) ||
          t.description?.toLowerCase().includes(needle) ||
          t.profile?.full_name?.toLowerCase().includes(needle) ||
          t.profile?.email?.toLowerCase().includes(needle)
      )
    }
    return list
  }, [trips, q, statusFilter])

  const resetForm = () => {
    setTitle('')
    setDesc('')
    setStart('')
    setEnd('')
    setTravelers('2')
    setBudget('')
    setStatus('planning')
    setIsPublic(false)
    setShowCreate(false)
    setEditingId(null)
  }

  const startEdit = (t: (typeof trips)[0]) => {
    setEditingId(t.id)
    setShowCreate(false)
    setTitle(t.title)
    setDesc(t.description ?? '')
    setStart(t.start_date ?? '')
    setEnd(t.end_date ?? '')
    setTravelers(String(t.traveler_count ?? 1))
    setBudget(t.budget_total != null ? String(t.budget_total) : '')
    setStatus(t.status)
    setIsPublic(!!t.is_public)
  }

  const submit = async () => {
    if (!title.trim() || title.trim().length < 2) {
      alert('Title is required (min 2 chars)')
      return
    }
    const payload = {
      title: title.trim(),
      description: desc.trim() || undefined,
      start_date: start || undefined,
      end_date: end || undefined,
      traveler_count: Math.max(1, Number(travelers) || 1),
      budget_total: budget ? Number(budget) : undefined,
      status,
      is_public: isPublic,
    }
    if (editingId) {
      await run(() => actions.tripUpdate.mutateAsync({ tripId: editingId, data: payload }), 'Trip updated')
    } else {
      if (!user?.id) {
        alert('Sign in required to create a trip')
        return
      }
      await run(
        () => actions.tripCreate.mutateAsync({ userId: user.id, data: payload }),
        'Trip created'
      )
    }
    resetForm()
  }

  const addDay = async (tripId: string) => {
    const existing = detail?.days?.length ?? 0
    await run(
      () => actions.tripAddDay.mutateAsync({ tripId, dayNumber: existing + 1, title: `Day ${existing + 1}` }),
      'Day added'
    )
  }

  const addStop = async () => {
    if (!newStopDayId || !newStopName.trim()) return
    await run(
      () =>
        actions.tripAddStop.mutateAsync({
          tripDayId: newStopDayId,
          custom_name: newStopName.trim(),
        }),
      'Stop added'
    )
    setNewStopName('')
    setNewStopDayId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <CalendarDays className="h-5 w-5 text-sky-600" /> Trip planner (CRUD)
          </h2>
          <p className="text-xs text-slate-500">
            Manage user trips and public itineraries. Staff can create, edit status, days/stops, and delete.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              downloadCsv('admin-trips.csv', [
                ['id', 'title', 'status', 'public', 'travelers', 'budget', 'start', 'end', 'owner'],
                ...filtered.map((t) => [
                  t.id,
                  t.title,
                  t.status,
                  String(!!t.is_public),
                  String(t.traveler_count),
                  String(t.budget_total ?? ''),
                  t.start_date ?? '',
                  t.end_date ?? '',
                  t.profile?.email ?? t.profile?.full_name ?? t.user_id,
                ]),
              ])
              flash(`Exported ${filtered.length} trips`)
            }}
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (showCreate || editingId) resetForm()
              else setShowCreate(true)
            }}
          >
            <Plus className="h-3.5 w-3.5" /> {showCreate || editingId ? 'Cancel' : 'New trip'}
          </Button>
        </div>
      </div>

      {banner && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          {banner}
        </div>
      )}

      {(showCreate || editingId) && (
        <Card className="border-sky-200 dark:border-sky-900">
          <CardContent className="space-y-3 p-4">
            <p className="text-sm font-semibold">{editingId ? 'Edit trip' : 'Create trip'}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} />
              <select className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={status} onChange={(e) => setStatus(e.target.value as TripStatus)}>
                {(['planning', 'active', 'completed', 'archived'] as TripStatus[]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input type="date" className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={start} onChange={(e) => setStart(e.target.value)} />
              <input type="date" className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={end} onChange={(e) => setEnd(e.target.value)} />
              <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Travelers" value={travelers} onChange={(e) => setTravelers(e.target.value)} />
              <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Budget (ETB)" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
            <textarea className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" rows={2} placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              Public (visible on explore / shared links)
            </label>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => run(submit)}>{editingId ? 'Save' : 'Create'}</Button>
              <Button size="sm" variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[160px] flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search trips, owners…" className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="rounded-lg border px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
          <option value="all">All status</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {isLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
      {!isLoading && filtered.length === 0 && (
        <p className="text-sm text-slate-400">No trips found. Create one or check RLS staff policies.</p>
      )}

      {filtered.map((t) => (
        <Card key={t.id} className={cn(expandId === t.id && 'ring-2 ring-sky-300/50')}>
          <CardContent className="space-y-2 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium">{t.title}{t.is_public ? ' · public' : ''}</p>
                <p className="text-xs text-slate-400">
                  {t.profile?.full_name || t.profile?.email || t.user_id.slice(0, 8)}
                  {t.start_date ? ` · ${t.start_date}` : ''}
                  {t.end_date ? ` → ${t.end_date}` : ''}
                  {` · ${t.traveler_count} travelers`}
                  {t.budget_total != null ? ` · ${t.budget_total} ${t.currency}` : ''}
                </p>
                {t.description && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{t.description}</p>}
              </div>
              <StatusBadge status={t.status} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Button size="sm" variant="outline" onClick={() => setExpandId(expandId === t.id ? null : t.id)}>
                {expandId === t.id ? 'Hide days' : 'Days / stops'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => startEdit(t)}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
              {t.status !== 'active' && (
                <Button size="sm" onClick={() => run(() => actions.tripStatus.mutateAsync({ tripId: t.id, status: 'active' }), 'Active')}>Activate</Button>
              )}
              {t.status !== 'archived' && (
                <Button size="sm" variant="outline" onClick={() => run(() => actions.tripStatus.mutateAsync({ tripId: t.id, status: 'archived' }), 'Archived')}>
                  <Archive className="h-3.5 w-3.5" /> Archive
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => run(() => actions.tripUpdate.mutateAsync({ tripId: t.id, data: { is_public: !t.is_public } as never }), t.is_public ? 'Made private' : 'Made public')}>
                {t.is_public ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {t.is_public ? 'Private' : 'Public'}
              </Button>
              <Button size="sm" variant="ghost" className="text-red-600" onClick={() => {
                if (!window.confirm(`Delete trip “${t.title}”? This removes days, stops, and expenses.`)) return
                run(() => actions.tripDelete.mutateAsync(t.id), 'Deleted')
                if (expandId === t.id) setExpandId(null)
              }}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {expandId === t.id && (
              <div className="mt-2 space-y-2 border-t pt-3 dark:border-slate-800">
                {detailLoading && <Loader2 className="h-5 w-5 animate-spin text-sky-500" />}
                {!detailLoading && (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Itinerary days</p>
                      <Button size="sm" variant="outline" onClick={() => addDay(t.id)}>
                        <Plus className="h-3.5 w-3.5" /> Add day
                      </Button>
                    </div>
                    {(detail?.days ?? []).length === 0 && (
                      <p className="text-xs text-slate-400">No days yet. Add Day 1 to start building the plan.</p>
                    )}
                    {(detail?.days ?? []).map((day) => (
                      <div key={day.id} className="rounded-lg border bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900/50">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">Day {day.day_number}{day.title ? ` — ${day.title}` : ''}</p>
                          <Button size="sm" variant="ghost" className="text-red-600" onClick={() => {
                            if (!window.confirm('Delete this day and its stops?')) return
                            run(() => actions.tripDeleteDay.mutateAsync(day.id), 'Day deleted')
                          }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <ul className="space-y-1">
                          {(day.stops ?? []).map((s) => (
                            <li key={s.id} className="flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
                              <span>{s.custom_name || s.place?.name || 'Stop'}{s.estimated_cost != null ? ` · ~${s.estimated_cost} ETB` : ''}</span>
                              <button type="button" className="text-red-500 hover:underline" onClick={() => run(() => actions.tripDeleteStop.mutateAsync(s.id), 'Stop removed')}>remove</button>
                            </li>
                          ))}
                        </ul>
                        {newStopDayId === day.id ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            <input className="min-w-[140px] flex-1 rounded border px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Stop name" value={newStopName} onChange={(e) => setNewStopName(e.target.value)} />
                            <Button size="sm" onClick={() => run(addStop)}>Add</Button>
                            <Button size="sm" variant="outline" onClick={() => { setNewStopDayId(null); setNewStopName('') }}>Cancel</Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost" className="mt-1" onClick={() => setNewStopDayId(day.id)}>
                            <Plus className="h-3.5 w-3.5" /> Stop
                          </Button>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
