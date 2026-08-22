import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Loader2, MapPin, MessageSquare, Building2, Flag, LayoutDashboard,
  Check, X, Eye, EyeOff, BadgeCheck, Users, Search, Download, Star, RefreshCw,
  Pencil, Trash2, RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import {
  useIsStaff, useAdminMetrics, useModerationPlaces, useModerationReviews,
  usePendingClaims, usePendingBusinesses, useOpenReports, useAdminUsers, useAdminActions,
} from '@/hooks/useAdmin'
import { downloadCsv, PROFILE_ROLES } from '@/services/admin'
import { PlaceEditor } from '@/components/admin/PlaceEditor'
import { cn } from '@/lib/utils'

type Tab = 'metrics' | 'places' | 'reviews' | 'claims' | 'businesses' | 'reports' | 'users'

export default function AdminPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth()
  const { data: staff, isLoading: roleLoading } = useIsStaff()
  const isStaff = !!staff?.isStaff
  const [tab, setTab] = useState<Tab>('metrics')
  const [placeQ, setPlaceQ] = useState('')
  const [placeStatusFilter, setPlaceStatusFilter] = useState<'all' | 'pending' | 'published' | 'archived' | 'draft'>('all')
  const [reviewQ, setReviewQ] = useState('')
  const [userQ, setUserQ] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [banner, setBanner] = useState<string | null>(null)
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)

  const { data: metrics, refetch: refetchMetrics, isFetching: metricsFetching } = useAdminMetrics(isStaff)
  const { data: places = [], isLoading: placesLoading, refetch: refetchPlaces } = useModerationPlaces(isStaff && (tab === 'places' || tab === 'metrics'))
  const { data: reviews = [], isLoading: reviewsLoading } = useModerationReviews(isStaff && tab === 'reviews')
  const { data: claims = [], isLoading: claimsLoading } = usePendingClaims(isStaff && tab === 'claims')
  const { data: businesses = [], isLoading: bizLoading } = usePendingBusinesses(isStaff && tab === 'businesses')
  const { data: reports = [], isLoading: reportsLoading } = useOpenReports(isStaff && tab === 'reports')
  const { data: users = [], isLoading: usersLoading } = useAdminUsers(isStaff && tab === 'users')
  const actions = useAdminActions()

  type PlaceRow = (typeof places)[0] & { deleted_at?: string | null; staff_notes?: string | null }

  const filteredPlaces = useMemo(() => {
    let list = places as PlaceRow[]
    list = showDeleted ? list.filter((p) => !!p.deleted_at) : list.filter((p) => !p.deleted_at)
    if (placeStatusFilter !== 'all') list = list.filter((p) => p.status === placeStatusFilter)
    const q = placeQ.trim().toLowerCase()
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q) || p.address?.toLowerCase().includes(q))
    return list
  }, [places, placeQ, placeStatusFilter, showDeleted])

  const filteredReviews = useMemo(() => {
    const q = reviewQ.trim().toLowerCase()
    if (!q) return reviews
    return reviews.filter((r) => r.comment?.toLowerCase().includes(q) || r.title?.toLowerCase().includes(q) || r.profile?.full_name?.toLowerCase().includes(q))
  }, [reviews, reviewQ])

  const filteredUsers = useMemo(() => {
    const q = userQ.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => u.email?.toLowerCase().includes(q) || u.full_name?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q))
  }, [users, userQ])

  const queueTotal = (metrics?.placesPending ?? 0) + (metrics?.claimsPending ?? 0) + (metrics?.businessesPending ?? 0) + (metrics?.reportsOpen ?? 0)

  const flash = (msg: string) => { setBanner(msg); window.setTimeout(() => setBanner(null), 3500) }
  const run = async (fn: () => Promise<unknown>, okMsg?: string) => {
    try { await fn(); if (okMsg) flash(okMsg) }
    catch (e) { alert(e instanceof Error ? e.message : 'Action failed — check RLS and role') }
  }

  if (authLoading || roleLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Shield className="mx-auto mb-4 h-12 w-12 text-slate-300" />
        <h1 className="mb-2 text-2xl font-bold">Admin</h1>
        <p className="mb-6 text-slate-500">Sign in with a staff account (admin or moderator).</p>
        <Link to="/auth"><Button size="lg">Log in</Button></Link>
      </div>
    )
  }

  if (!isStaff) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Shield className="mx-auto mb-4 h-12 w-12 text-amber-400" />
        <h1 className="mb-2 text-2xl font-bold">Access restricted</h1>
        <p className="mb-4 text-slate-500">Your role is <strong>{staff?.role ?? 'visitor'}</strong>. Only admin or moderator can open this dashboard.</p>
        <p className="mb-6 rounded-lg bg-slate-100 p-3 text-left text-xs dark:bg-slate-900">
          <code>UPDATE profiles SET role = &apos;admin&apos; WHERE email = &apos;bahirdar333@gmail.com&apos;;</code>
        </p>
        <Link to="/"><Button variant="outline">Back home</Button></Link>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: 'metrics', label: 'Overview', icon: LayoutDashboard, badge: queueTotal || undefined },
    { id: 'places', label: 'Places', icon: MapPin, badge: metrics?.placesPending || undefined },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'claims', label: 'Claims', icon: BadgeCheck, badge: metrics?.claimsPending || undefined },
    { id: 'businesses', label: 'Business', icon: Building2, badge: metrics?.businessesPending || undefined },
    { id: 'reports', label: 'Reports', icon: Flag, badge: metrics?.reportsOpen || undefined },
    { id: 'users', label: 'Users', icon: Users },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold"><Shield className="h-7 w-7 text-sky-600" /> Admin</h1>
          <p className="text-sm text-slate-500">
            Signed in as <span className="font-medium capitalize">{staff?.role}</span>
            {queueTotal > 0 && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">{queueTotal} in queue</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => { refetchMetrics(); refetchPlaces(); actions.invalidate(); flash('Refreshed') }}>
            <RefreshCw className={cn('h-3.5 w-3.5', metricsFetching && 'animate-spin')} /> Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={() => {
            if (!metrics) return
            downloadCsv('admin-metrics.csv', [['metric', 'value'], ...Object.entries(metrics).map(([k, v]) => [k, String(v)])])
            flash('Metrics exported')
          }}><Download className="h-3.5 w-3.5" /> Export</Button>
        </div>
      </div>

      {banner && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{banner}</div>}

      <div className="mb-6 flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={cn('relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium', tab === t.id ? 'bg-white shadow dark:bg-slate-800' : 'text-slate-500')}>
            <t.icon className="h-3.5 w-3.5" />{t.label}
            {t.badge != null && t.badge > 0 && <span className="ml-0.5 rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">{t.badge}</span>}
          </button>
        ))}
      </div>

      {tab === 'metrics' && metrics && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([['Places', metrics.placesTotal, 'places'], ['Published', metrics.placesPublished, 'places'], ['Pending places', metrics.placesPending, 'places'], ['Reviews', metrics.reviewsTotal, 'reviews'], ['Hidden reviews', metrics.reviewsHidden, 'reviews'], ['Claims', metrics.claimsPending, 'claims'], ['Businesses', metrics.businessesPending, 'businesses'], ['Reports', metrics.reportsOpen, 'reports'], ['Users', metrics.usersApprox, 'users']] as [string, number, Tab][]).map(([label, value, jump]) => (
            <button key={label} type="button" onClick={() => setTab(jump)} className="text-left">
              <Card className="hover:border-sky-300"><CardContent className="p-4"><p className="text-xs text-slate-400">{label}</p><p className="text-2xl font-bold">{value}</p></CardContent></Card>
            </button>
          ))}
        </div>
      )}

      {tab === 'places' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border px-2 dark:border-slate-700">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={placeQ} onChange={(e) => setPlaceQ(e.target.value)} placeholder="Search places…" className="w-full bg-transparent py-2 text-sm outline-none" />
            </div>
            <select value={placeStatusFilter} onChange={(e) => setPlaceStatusFilter(e.target.value as typeof placeStatusFilter)} className="rounded-lg border px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
              <option value="draft">Draft</option>
            </select>
            <Button size="sm" variant={showDeleted ? 'default' : 'outline'} onClick={() => setShowDeleted((v) => !v)}>{showDeleted ? 'Showing deleted' : 'Show deleted'}</Button>
            <Button size="sm" variant="outline" onClick={() => {
              downloadCsv('places.csv', [['id', 'name', 'status', 'verified'], ...filteredPlaces.map((p) => [p.id, p.name, p.status ?? '', String(!!p.verified)])])
              flash('CSV downloaded')
            }}><Download className="h-3.5 w-3.5" /> CSV</Button>
          </div>

          {selected.size > 0 && (
            <div className="flex flex-wrap gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm dark:bg-sky-950/40">
              <span className="font-medium">{selected.size} selected</span>
              <Button size="sm" onClick={() => run(() => actions.bulkPlaces.mutateAsync({ placeIds: [...selected], status: 'published', verified: true }), `Published ${selected.size}`).then(() => setSelected(new Set()))}>Bulk publish</Button>
              <Button size="sm" variant="outline" onClick={() => run(() => actions.bulkPlaces.mutateAsync({ placeIds: [...selected], status: 'archived' }), `Archived ${selected.size}`).then(() => setSelected(new Set()))}>Bulk archive</Button>
              <Button size="sm" variant="outline" className="text-red-600" onClick={() => { if (!window.confirm(`Soft-delete ${selected.size}?`)) return; run(() => actions.bulkDelete.mutateAsync([...selected]), 'Deleted').then(() => setSelected(new Set())) }}>Bulk delete</Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set(filteredPlaces.map((p) => p.id)))}>Select all</Button>
            </div>
          )}

          {placesLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {!placesLoading && filteredPlaces.length === 0 && <p className="text-sm text-slate-500">No places match. Apply admin migrations if empty.</p>}

          {filteredPlaces.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-3">
                <div className="flex flex-wrap items-start gap-2">
                  <input type="checkbox" className="mt-1" checked={selected.has(p.id)} onChange={() => setSelected((prev) => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n })} />
                  <div className="min-w-0 flex-1">
                    <Link to={`/places/${p.slug}`} className="text-sm font-medium hover:text-sky-600">{p.name}</Link>
                    <p className="text-xs text-slate-400">{p.status}{p.verified ? ' · verified' : ''}{p.featured ? ' · featured' : ''}{p.deleted_at ? ' · DELETED' : ''}</p>
                    {p.address && <p className="text-xs text-slate-500">{p.address}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button size="sm" variant="outline" onClick={() => run(() => actions.placeStatus.mutateAsync({ placeId: p.id, status: 'published', verified: true }), 'Published')}><Check className="h-3.5 w-3.5" /> Publish</Button>
                    <Button size="sm" variant="ghost" onClick={() => run(() => actions.placeStatus.mutateAsync({ placeId: p.id, status: 'archived' }), 'Archived')}><EyeOff className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => run(() => actions.placeFeatured.mutateAsync({ placeId: p.id, featured: !p.featured }), p.featured ? 'Unfeatured' : 'Featured')}><Star className={cn('h-3.5 w-3.5', p.featured && 'fill-amber-400 text-amber-400')} /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingPlaceId(editingPlaceId === p.id ? null : p.id)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                    {p.deleted_at ? (
                      <Button size="sm" variant="outline" onClick={() => run(() => actions.placeRestore.mutateAsync(p.id), 'Restored')}><RotateCcw className="h-3.5 w-3.5" /> Restore</Button>
                    ) : (
                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => { if (!window.confirm(`Soft-delete "${p.name}"?`)) return; run(() => actions.placeSoftDelete.mutateAsync(p.id), 'Soft-deleted') }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-red-700 text-xs" onClick={() => { if (!window.confirm(`PERMANENTLY delete "${p.name}"?`)) return; run(() => actions.placeHardDelete.mutateAsync(p.id), 'Permanently deleted') }}>Hard del</Button>
                  </div>
                </div>
                {editingPlaceId === p.id && (
                  <div className="mt-3">
                    <PlaceEditor
                      place={p}
                      saving={actions.placeUpdate.isPending}
                      onCancel={() => setEditingPlaceId(null)}
                      onSave={async (data) => { await run(() => actions.placeUpdate.mutateAsync({ placeId: p.id, data }), 'Place updated'); setEditingPlaceId(null) }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-lg border px-2 dark:border-slate-700">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={reviewQ} onChange={(e) => setReviewQ(e.target.value)} placeholder="Search reviews…" className="w-full bg-transparent py-2 text-sm outline-none" />
          </div>
          {reviewsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {filteredReviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-3">
                <div className="mb-1 flex flex-wrap gap-2 text-sm">
                  <span className="font-medium">{r.profile?.full_name || 'User'}</span>
                  <span className="text-amber-600">{r.rating}★</span>
                  <span className="rounded bg-slate-100 px-1.5 text-[10px] uppercase dark:bg-slate-800">{r.status}</span>
                </div>
                {r.title && <p className="text-sm font-medium">{r.title}</p>}
                <p className="line-clamp-3 text-sm text-slate-600">{r.comment}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.status !== 'published' && <Button size="sm" variant="outline" onClick={() => run(() => actions.reviewStatus.mutateAsync({ reviewId: r.id, status: 'published' }), 'Published')}><Eye className="h-3.5 w-3.5" /> Publish</Button>}
                  {r.status !== 'hidden' && <Button size="sm" variant="ghost" onClick={() => run(() => actions.reviewStatus.mutateAsync({ reviewId: r.id, status: 'hidden' }), 'Hidden')}><EyeOff className="h-3.5 w-3.5" /> Hide</Button>}
                  <Button size="sm" variant="ghost" className="text-red-600" onClick={() => { if (!window.confirm('Delete this review permanently?')) return; run(() => actions.reviewDelete.mutateAsync(r.id), 'Review deleted') }}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'claims' && (
        <div className="space-y-2">
          {claimsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {!claimsLoading && claims.length === 0 && <p className="text-sm text-slate-500">No pending claims.</p>}
          {claims.map((c) => (
            <Card key={c.id}><CardContent className="p-3">
              <p className="text-sm font-medium">{c.place?.name ?? c.place_id}</p>
              {c.message && <p className="mt-1 text-sm text-slate-600">{c.message}</p>}
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => run(() => actions.claim.mutateAsync({ claimId: c.id, approve: true }), 'Approved')}><Check className="h-3.5 w-3.5" /> Approve</Button>
                <Button size="sm" variant="outline" onClick={() => run(() => actions.claim.mutateAsync({ claimId: c.id, approve: false }), 'Rejected')}><X className="h-3.5 w-3.5" /> Reject</Button>
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}

      {tab === 'businesses' && (
        <div className="space-y-2">
          {bizLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {businesses.map((b) => (
            <Card key={b.id}><CardContent className="p-3">
              <p className="text-sm font-medium">{b.business_name}</p>
              <p className="text-xs text-slate-400">{b.contact_name} · {b.email || b.phone}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => run(() => actions.business.mutateAsync({ businessId: b.id, status: 'approved' }), 'Approved')}><Check className="h-3.5 w-3.5" /> Approve</Button>
                <Button size="sm" variant="outline" onClick={() => run(() => actions.business.mutateAsync({ businessId: b.id, status: 'suspended' }), 'Suspended')}>Suspend</Button>
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}

      {tab === 'reports' && (
        <div className="space-y-2">
          {reportsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {(reports as { id: string; reason: string; details?: string; review?: { comment?: string; rating?: number } }[]).map((r) => (
            <Card key={r.id}><CardContent className="p-3">
              <p className="text-sm font-medium">Reason: {r.reason}</p>
              {r.review && <p className="mt-1 line-clamp-2 text-sm text-slate-600">Review ({r.review.rating}★): {r.review.comment}</p>}
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => run(() => actions.report.mutateAsync({ reportId: r.id, status: 'resolved' }), 'Resolved')}>Resolve</Button>
                <Button size="sm" variant="outline" onClick={() => run(() => actions.report.mutateAsync({ reportId: r.id, status: 'dismissed' }), 'Dismissed')}>Dismiss</Button>
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-lg border px-2 dark:border-slate-700">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={userQ} onChange={(e) => setUserQ(e.target.value)} placeholder="Search users…" className="w-full bg-transparent py-2 text-sm outline-none" />
          </div>
          {usersLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {!usersLoading && filteredUsers.length === 0 && (
            <p className="text-sm text-slate-500">No users. Run migrations 20260822070000 + 20260822080000.</p>
          )}
          {filteredUsers.map((u) => (
            <Card key={u.id}><CardContent className="flex flex-wrap items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{u.full_name || 'Unnamed'}</p>
                <p className="text-xs text-slate-400">{u.email || u.id}</p>
              </div>
              <select
                value={u.role || 'visitor'}
                disabled={u.id === user?.id}
                onChange={(e) => {
                  const role = e.target.value
                  if (!window.confirm(`Set role to "${role}"?`)) { e.target.value = u.role; return }
                  run(() => actions.userRole.mutateAsync({ userId: u.id, role }), `Role → ${role}`)
                }}
                className="rounded-lg border px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                {PROFILE_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </CardContent></Card>
          ))}
        </div>
      )}
    </div>
  )
}
