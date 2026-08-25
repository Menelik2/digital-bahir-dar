import { useState } from 'react'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAdminEvents, useAdminActions } from '@/hooks/useAdmin'
import type { CmsEventRow } from '@/services/cms'

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    archived: 'bg-slate-200 text-slate-500 dark:bg-slate-700',
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

export function EventsCmsPanel() {
  const { data: cmsEvents = [], isLoading: eventsLoading } = useAdminEvents(true)
  const actions = useAdminActions()
  const [showEventCreate, setShowEventCreate] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const [evTitle, setEvTitle] = useState('')
  const [evDate, setEvDate] = useState('')
  const [evTime, setEvTime] = useState('')
  const [evVenue, setEvVenue] = useState('')
  const [evCat, setEvCat] = useState<'culture' | 'music' | 'market' | 'sports' | 'community' | 'seasonal'>('culture')
  const [evDesc, setEvDesc] = useState('')
  const [evPrice, setEvPrice] = useState('Check locally')
  const [evFeatured, setEvFeatured] = useState(false)
  const [evStatus, setEvStatus] = useState<'draft' | 'published' | 'archived'>('published')

  const flash = (msg: string) => {
    setBanner(msg)
    window.setTimeout(() => setBanner(null), 3000)
  }
  const run = async (fn: () => Promise<unknown>, okMsg?: string) => {
    try {
      await fn()
      if (okMsg) flash(okMsg)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Action failed — check RLS and city_events migration')
    }
  }

  return (
    <div className="space-y-3">
      {banner && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">{banner}</div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">
          CMS: manage city events (text + publish). Shown on the public <strong>/events</strong> page when status is published.
        </p>
        <Button size="sm" onClick={() => setShowEventCreate((v) => !v)}>
          <Plus className="h-3.5 w-3.5" /> {showEventCreate ? 'Cancel' : 'New event'}
        </Button>
      </div>

      {showEventCreate && (
        <Card className="border-sky-200 dark:border-sky-900">
          <CardContent className="space-y-3 p-4">
            <p className="text-sm font-semibold">Create event</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Title *" value={evTitle} onChange={(e) => setEvTitle(e.target.value)} />
              <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Date label *" value={evDate} onChange={(e) => setEvDate(e.target.value)} />
              <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Time (optional)" value={evTime} onChange={(e) => setEvTime(e.target.value)} />
              <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Venue *" value={evVenue} onChange={(e) => setEvVenue(e.target.value)} />
              <select className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={evCat} onChange={(e) => setEvCat(e.target.value as typeof evCat)}>
                {(['culture', 'music', 'market', 'sports', 'community', 'seasonal'] as const).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={evStatus} onChange={(e) => setEvStatus(e.target.value as typeof evStatus)}>
                <option value="published">published</option>
                <option value="draft">draft</option>
                <option value="archived">archived</option>
              </select>
              <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 sm:col-span-2" placeholder="Price label" value={evPrice} onChange={(e) => setEvPrice(e.target.value)} />
              <textarea className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 sm:col-span-2" rows={3} placeholder="Description *" value={evDesc} onChange={(e) => setEvDesc(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={evFeatured} onChange={(e) => setEvFeatured(e.target.checked)} /> Featured
            </label>
            <Button
              size="sm"
              disabled={actions.eventCreate.isPending || !evTitle.trim() || !evDate.trim() || !evVenue.trim() || !evDesc.trim()}
              onClick={() =>
                run(
                  () =>
                    actions.eventCreate.mutateAsync({
                      title: evTitle,
                      date_label: evDate,
                      time_label: evTime || null,
                      venue: evVenue,
                      category: evCat,
                      description: evDesc,
                      price_label: evPrice,
                      featured: evFeatured,
                      status: evStatus,
                    }),
                  'Event created'
                ).then(() => {
                  setEvTitle('')
                  setEvDate('')
                  setEvTime('')
                  setEvVenue('')
                  setEvDesc('')
                  setShowEventCreate(false)
                })
              }
            >
              {actions.eventCreate.isPending ? 'Saving…' : 'Create event'}
            </Button>
          </CardContent>
        </Card>
      )}

      {eventsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
      {!eventsLoading && cmsEvents.length === 0 && (
        <p className="text-sm text-slate-500">No events in database. Run migration <code>20260825130000_backend_events_search.sql</code> or create one above.</p>
      )}

      {cmsEvents.map((ev: CmsEventRow) => (
        <Card key={ev.id}>
          <CardContent className="p-3">
            {editingEventId === ev.id ? (
              <div className="space-y-2">
                <input className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue={ev.title} id={`ev-title-${ev.id}`} />
                <input className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue={ev.date_label} id={`ev-date-${ev.id}`} />
                <input className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue={ev.venue} id={`ev-venue-${ev.id}`} />
                <textarea className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" rows={3} defaultValue={ev.description} id={`ev-desc-${ev.id}`} />
                <select className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue={ev.status ?? 'published'} id={`ev-status-${ev.id}`}>
                  <option value="published">published</option>
                  <option value="draft">draft</option>
                  <option value="archived">archived</option>
                </select>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const title = (document.getElementById(`ev-title-${ev.id}`) as HTMLInputElement)?.value
                      const date_label = (document.getElementById(`ev-date-${ev.id}`) as HTMLInputElement)?.value
                      const venue = (document.getElementById(`ev-venue-${ev.id}`) as HTMLInputElement)?.value
                      const description = (document.getElementById(`ev-desc-${ev.id}`) as HTMLTextAreaElement)?.value
                      const status = (document.getElementById(`ev-status-${ev.id}`) as HTMLSelectElement)?.value as 'draft' | 'published' | 'archived'
                      run(
                        () => actions.eventUpdate.mutateAsync({ id: ev.id, data: { title, date_label, venue, description, status } }),
                        'Event updated'
                      ).then(() => setEditingEventId(null))
                    }}
                  >
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingEventId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{ev.title}</p>
                    <StatusBadge status={ev.status ?? 'published'} />
                    {ev.featured && <span className="text-[10px] font-semibold text-amber-600">FEATURED</span>}
                  </div>
                  <p className="text-xs text-slate-400">
                    {ev.date_label}
                    {ev.time_label ? ` · ${ev.time_label}` : ''} · {ev.venue}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{ev.description}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setEditingEventId(ev.id)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  {(ev.status ?? 'published') !== 'published' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => run(() => actions.eventUpdate.mutateAsync({ id: ev.id, data: { status: 'published' } }), 'Published')}
                    >
                      Publish
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600"
                    onClick={() => {
                      if (!window.confirm(`Delete event "${ev.title}"?`)) return
                      run(() => actions.eventDelete.mutateAsync(ev.id), 'Deleted')
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
