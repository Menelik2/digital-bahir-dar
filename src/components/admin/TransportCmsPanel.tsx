import { useMemo, useState } from 'react'
import { Bus, Loader2, Plus, Trash2, Check, Download, Pencil, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAdminTransport, useAdminActions } from '@/hooks/useAdmin'
import { downloadCsv } from '@/services/admin'
import type { TransportService } from '@/types/place'
import { cn } from '@/lib/utils'

const SERVICE_TYPES = [
  'taxi',
  'bajaj',
  'bus',
  'minibus',
  'boat',
  'airport_shuttle',
  'rental',
  'other',
] as const

const emptyForm = {
  service_type: 'taxi',
  provider_name: '',
  phone: '',
  estimated_price_min: '',
  estimated_price_max: '',
  route_description: '',
  verified: false,
}

export function TransportCmsPanel() {
  const { data: rows = [], isLoading, refetch, isFetching } = useAdminTransport(true)
  const actions = useAdminActions()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all')
  const [banner, setBanner] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const flash = (msg: string) => {
    setBanner(msg)
    window.setTimeout(() => setBanner(null), 3500)
  }

  const run = async (fn: () => Promise<unknown>, okMsg?: string) => {
    try {
      await fn()
      if (okMsg) flash(okMsg)
      void refetch()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Action failed — check RLS / staff role')
    }
  }

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return rows
      .filter((r) => {
        if (filter === 'verified' && !r.verified) return false
        if (filter === 'unverified' && r.verified) return false
        if (!query) return true
        const hay = `${r.provider_name} ${r.service_type} ${r.phone ?? ''} ${r.route_description ?? ''}`.toLowerCase()
        return hay.includes(query)
      })
      .sort((a, b) => Number(!!b.verified) - Number(!!a.verified) || a.provider_name.localeCompare(b.provider_name))
  }, [rows, q, filter])

  const startEdit = (r: TransportService) => {
    setEditingId(r.id)
    setShowCreate(false)
    setForm({
      service_type: r.service_type || 'taxi',
      provider_name: r.provider_name || '',
      phone: r.phone || '',
      estimated_price_min: r.estimated_price_min != null ? String(r.estimated_price_min) : '',
      estimated_price_max: r.estimated_price_max != null ? String(r.estimated_price_max) : '',
      route_description: r.route_description || '',
      verified: !!r.verified,
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setShowCreate(false)
    setForm(emptyForm)
  }

  const parseNum = (s: string) => {
    const n = Number(s)
    return s.trim() === '' || Number.isNaN(n) ? null : n
  }

  const save = async () => {
    if (!form.provider_name.trim()) {
      alert('Provider name is required')
      return
    }
    const payload = {
      service_type: form.service_type,
      provider_name: form.provider_name.trim(),
      phone: form.phone.trim() || null,
      estimated_price_min: parseNum(form.estimated_price_min),
      estimated_price_max: parseNum(form.estimated_price_max),
      route_description: form.route_description.trim() || null,
      verified: form.verified,
    }
    if (editingId) {
      await run(
        () => actions.transportUpdate.mutateAsync({ id: editingId, data: payload }),
        'Transport updated'
      )
    } else {
      await run(() => actions.transportCreate.mutateAsync(payload), 'Transport created')
    }
    resetForm()
  }

  return (
    <div className="space-y-4">
      {banner && (
        <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200">
          {banner}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Bus className="h-4 w-4 text-sky-600" />
            Transport services
          </h2>
          <p className="text-xs text-slate-500">
            {rows.length} total · {rows.filter((r) => r.verified).length} verified
            {isFetching && !isLoading ? ' · refreshing…' : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadCsv('transport.csv', [
                ['id', 'type', 'provider', 'phone', 'min', 'max', 'verified', 'route'],
                ...filtered.map((r) => [
                  r.id,
                  r.service_type,
                  r.provider_name,
                  r.phone ?? '',
                  String(r.estimated_price_min ?? ''),
                  String(r.estimated_price_max ?? ''),
                  r.verified ? 'yes' : 'no',
                  r.route_description ?? '',
                ]),
              ])
            }
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setShowCreate(true)
              setEditingId(null)
              setForm(emptyForm)
            }}
          >
            <Plus className="h-3.5 w-3.5" /> Add service
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search provider, type, phone, route…"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {(showCreate || editingId) && (
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{editingId ? 'Edit service' : 'New service'}</p>
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-500">
                Type
                <select
                  value={form.service_type}
                  onChange={(e) => setForm((f) => ({ ...f, service_type: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  {SERVICE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-medium text-slate-500">
                Provider name *
                <input
                  value={form.provider_name}
                  onChange={(e) => setForm((f) => ({ ...f, provider_name: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
              <label className="text-xs font-medium text-slate-500">
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
              <label className="text-xs font-medium text-slate-500">
                Price min (ETB)
                <input
                  type="number"
                  value={form.estimated_price_min}
                  onChange={(e) => setForm((f) => ({ ...f, estimated_price_min: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
              <label className="text-xs font-medium text-slate-500">
                Price max (ETB)
                <input
                  type="number"
                  value={form.estimated_price_max}
                  onChange={(e) => setForm((f) => ({ ...f, estimated_price_max: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-500 sm:pt-6">
                <input
                  type="checkbox"
                  checked={form.verified}
                  onChange={(e) => setForm((f) => ({ ...f, verified: e.target.checked }))}
                />
                Verified
              </label>
            </div>
            <label className="block text-xs font-medium text-slate-500">
              Route / notes
              <textarea
                value={form.route_description}
                onChange={(e) => setForm((f) => ({ ...f, route_description: e.target.value }))}
                rows={2}
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => void save()} disabled={actions.transportCreate.isPending || actions.transportUpdate.isPending}>
                {editingId ? 'Save changes' : 'Create'}
              </Button>
              <Button size="sm" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}

      {!isLoading && filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-slate-500">No transport services match.</p>
      )}

      <div className="space-y-2">
        {filtered.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">
                  {r.provider_name}{' '}
                  <span
                    className={cn(
                      'ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase',
                      r.verified
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    )}
                  >
                    {r.verified ? 'verified' : 'unverified'}
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  {r.service_type}
                  {r.phone ? ` · ${r.phone}` : ''}
                  {r.estimated_price_min != null || r.estimated_price_max != null
                    ? ` · ETB ${r.estimated_price_min ?? '?'}–${r.estimated_price_max ?? '?'}`
                    : ''}
                </p>
                {r.route_description && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{r.route_description}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    void run(
                      () => actions.transportVerified.mutateAsync({ id: r.id, verified: !r.verified }),
                      r.verified ? 'Unverified' : 'Verified'
                    )
                  }
                >
                  <Check className={cn('h-3.5 w-3.5', r.verified && 'text-emerald-600')} />
                  {r.verified ? 'Unverify' : 'Verify'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => startEdit(r)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-rose-600"
                  onClick={() => {
                    if (!window.confirm(`Delete ${r.provider_name}?`)) return
                    void run(() => actions.transportDelete.mutateAsync(r.id), 'Deleted')
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
