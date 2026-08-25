import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import {
  Shield, Loader2, MapPin, MessageSquare, Building2, Flag, LayoutDashboard,
  Check, X, Eye, EyeOff, BadgeCheck, Users, Search, Download, Star, RefreshCw,
  Pencil, Trash2, RotateCcw, Plus, AlertTriangle, Clock, Tags, Bus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import {
  useIsStaff, useAdminMetrics, useModerationPlaces, useModerationReviews,
  usePendingClaims, usePendingBusinesses, useOpenReports, useAdminUsers,
  useAdminActions, useAdminCategories, useAdminTransport,
} from '@/hooks/useAdmin'
import { downloadCsv, PROFILE_ROLES, slugify } from '@/services/admin'
import { PlaceEditor } from '@/components/admin/PlaceEditor'
import { cn } from '@/lib/utils'

type Tab = 'metrics' | 'places' | 'reviews' | 'claims' | 'businesses' | 'reports' | 'users' | 'categories' | 'transport'

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    archived: 'bg-slate-200 text-slate-500 dark:bg-slate-700',
    hidden: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
    approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    rejected: 'bg-rose-100 text-rose-800',
    suspended: 'bg-orange-100 text-orange-800',
    open: 'bg-rose-100 text-rose-800',
    resolved: 'bg-emerald-100 text-emerald-800',
    dismissed: 'bg-slate-100 text-slate-500',
  }
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide', styles[status] ?? 'bg-slate-100 text-slate-600')}>
      {status}
    </span>
  )
}

function relativeTime(iso?: string | null) {
  if (!iso) return ''
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true })
  } catch {
    return ''
  }
}

export default function AdminPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth()
  const { data: staff, isLoading: roleLoading } = useIsStaff()
  const isStaff = !!staff?.isStaff
  const [tab, setTab] = useState<Tab>('metrics')
  const [placeQ, setPlaceQ] = useState('')
  const [placeStatusFilter, setPlaceStatusFilter] = useState<'all' | 'pending' | 'published' | 'archived' | 'draft'>('all')
  const [placeCategoryFilter, setPlaceCategoryFilter] = useState('all')
  const [reviewQ, setReviewQ] = useState('')
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'all' | 'published' | 'hidden' | 'pending'>('all')
  const [userQ, setUserQ] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [bizStatusFilter, setBizStatusFilter] = useState<'all' | 'pending' | 'approved' | 'suspended'>('pending')
  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'open' | 'resolved' | 'dismissed'>('open')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(new Set())
  const [banner, setBanner] = useState<string | null>(null)
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showCatCreate, setShowCatCreate] = useState(false)
  const [catName, setCatName] = useState('')
  const [catSlug, setCatSlug] = useState('')
  const [catIcon, setCatIcon] = useState('')
  const [catSort, setCatSort] = useState('50')
  const [editingCatId, setEditingCatId] = useState<string | null>(null)

  const [cName, setCName] = useState('')
  const [cSlug, setCSlug] = useState('')
  const [cCategory, setCCategory] = useState('')
  const [cAddress, setCAddress] = useState('')
  const [cLat, setCLat] = useState('11.5742')
  const [cLng, setCLng] = useState('37.3614')
  const [cDesc, setCDesc] = useState('')
  const [cStatus, setCStatus] = useState('pending')
  const [cVerified, setCVerified] = useState(false)

  const { data: metrics, refetch: refetchMetrics, isFetching: metricsFetching } = useAdminMetrics(isStaff)
  const { data: categories = [] } = useAdminCategories(isStaff)
  const { data: transportList = [], isLoading: transportLoading } = useAdminTransport(isStaff && (tab === 'transport' || tab === 'metrics'))
  const { data: places = [], isLoading: placesLoading, refetch: refetchPlaces } = useModerationPlaces(isStaff && (tab === 'places' || tab === 'metrics'))
  const { data: reviews = [], isLoading: reviewsLoading } = useModerationReviews(isStaff && (tab === 'reviews' || tab === 'metrics'))
  const { data: claims = [], isLoading: claimsLoading } = usePendingClaims(isStaff && (tab === 'claims' || tab === 'metrics'))
  const { data: businesses = [], isLoading: bizLoading } = usePendingBusinesses(isStaff && (tab === 'businesses' || tab === 'metrics'))
  const { data: reports = [], isLoading: reportsLoading } = useOpenReports(isStaff && (tab === 'reports' || tab === 'metrics'))
  const { data: users = [], isLoading: usersLoading } = useAdminUsers(isStaff && tab === 'users')
  const actions = useAdminActions()

  type PlaceRow = (typeof places)[0] & { deleted_at?: string | null; staff_notes?: string | null }

  const filteredPlaces = useMemo(() => {
    let list = places as PlaceRow[]
    list = showDeleted ? list.filter((p) => !!p.deleted_at) : list.filter((p) => !p.deleted_at)
    if (placeStatusFilter !== 'all') list = list.filter((p) => p.status === placeStatusFilter)
    if (placeCategoryFilter !== 'all') list = list.filter((p) => p.category_id === placeCategoryFilter || p.category?.slug === placeCategoryFilter)
    const q = placeQ.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q) ||
          p.staff_notes?.toLowerCase().includes(q)
      )
    }
    return list
  }, [places, placeQ, placeStatusFilter, placeCategoryFilter, showDeleted])

  const filteredReviews = useMemo(() => {
    let list = reviews
    if (reviewStatusFilter !== 'all') list = list.filter((r) => r.status === reviewStatusFilter)
    const q = reviewQ.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (r) =>
          r.comment?.toLowerCase().includes(q) ||
          r.title?.toLowerCase().includes(q) ||
          r.profile?.full_name?.toLowerCase().includes(q) ||
          (r as { place?: { name?: string } }).place?.name?.toLowerCase().includes(q)
      )
    }
    return list
  }, [reviews, reviewQ, reviewStatusFilter])

  const filteredUsers = useMemo(() => {
    let list = users
    if (userRoleFilter !== 'all') list = list.filter((u) => u.role === userRoleFilter)
    const q = userQ.trim().toLowerCase()
    if (q) list = list.filter((u) => u.email?.toLowerCase().includes(q) || u.full_name?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q))
    return list
  }, [users, userQ, userRoleFilter])

  const filteredBusinesses = useMemo(() => {
    if (bizStatusFilter === 'all') return businesses
    return businesses.filter((b) => b.status === bizStatusFilter)
  }, [businesses, bizStatusFilter])

  const filteredReports = useMemo(() => {
    const list = reports as { id: string; reason: string; details?: string; status?: string; created_at?: string; review?: { comment?: string; rating?: number; status?: string; place?: { name?: string; slug?: string } }; reporter?: { full_name?: string; email?: string } }[]
    if (reportStatusFilter === 'all') return list
    return list.filter((r) => (r.status ?? 'open') === reportStatusFilter)
  }, [reports, reportStatusFilter])

  const queueTotal =
    (metrics?.placesPending ?? 0) +
    (metrics?.claimsPending ?? 0) +
    (metrics?.businessesPending ?? 0) +
    (metrics?.reportsOpen ?? 0)

  const flash = (msg: string) => {
    setBanner(msg)
    window.setTimeout(() => setBanner(null), 3500)
  }
  const run = async (fn: () => Promise<unknown>, okMsg?: string) => {
    try {
      await fn()
      if (okMsg) flash(okMsg)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Action failed — check RLS and role')
    }
  }

  const resetCreate = () => {
    setCName('')
    setCSlug('')
    setCCategory(categories[0]?.id ?? '')
    setCAddress('')
    setCLat('11.5742')
    setCLng('37.3614')
    setCDesc('')
    setCStatus('pending')
    setCVerified(false)
    setShowCreate(false)
  }

  const submitCreate = async () => {
    if (!cName.trim() || !cCategory) {
      alert('Name and category are required')
      return
    }
    const lat = Number(cLat)
    const lng = Number(cLng)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      alert('Valid latitude and longitude required')
      return
    }
    await run(
      () =>
        actions.placeCreate.mutateAsync({
          name: cName.trim(),
          slug: (cSlug || slugify(cName)).trim(),
          category_id: cCategory,
          address: cAddress || null,
          latitude: lat,
          longitude: lng,
          short_description: cDesc || null,
          status: cStatus,
          verified: cVerified,
        }),
      'Place created'
    )
    resetCreate()
  }

  if (authLoading || roleLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

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
          <code>UPDATE profiles SET role = 'admin' WHERE email = 'bahirdar333@gmail.com';</code>
        </p>
        <Link to="/"><Button variant="outline">Back home</Button></Link>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: 'metrics', label: 'Overview', icon: LayoutDashboard, badge: queueTotal || undefined },
    { id: 'places', label: 'Places', icon: MapPin, badge: metrics?.placesPending || undefined },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, badge: metrics?.reviewsPending || undefined },
    { id: 'claims', label: 'Claims', icon: BadgeCheck, badge: metrics?.claimsPending || undefined },
    { id: 'businesses', label: 'Business', icon: Building2, badge: metrics?.businessesPending || undefined },
    { id: 'reports', label: 'Reports', icon: Flag, badge: metrics?.reportsOpen || undefined },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'transport', label: 'Transport', icon: Bus },
  ]

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Shield className="h-7 w-7 text-sky-600" /> Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Signed in as <span className="font-medium capitalize">{staff?.role}</span>
            {queueTotal > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {queueTotal} in queue
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => { refetchMetrics(); refetchPlaces(); actions.invalidate(); flash('Refreshed') }}>
            <RefreshCw className={cn('h-3.5 w-3.5', metricsFetching && 'animate-spin')} /> Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={() => {
            if (!metrics) return
            downloadCsv('admin-metrics.csv', [['metric', 'value'], ...Object.entries(metrics).map(([k, v]) => [k, String(v)])])
            flash('Metrics exported')
          }}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      {banner && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">{banner}</div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-52 lg:shrink-0">
          <nav className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900 lg:flex-col">
            {tabs.map((t) => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)} className={cn(
                'relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                tab === t.id ? 'bg-white text-sky-700 shadow dark:bg-slate-800 dark:text-sky-300' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              )}>
                <t.icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{t.label}</span>
                {t.badge != null && t.badge > 0 && (
                  <span className="ml-auto rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">{t.badge}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {tab === 'metrics' && metrics && (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {([['Places total', metrics.placesTotal, 'places', MapPin], ['Published', metrics.placesPublished, 'places', Check], ['Pending places', metrics.placesPending, 'places', Clock], ['Featured', metrics.placesFeatured ?? 0, 'places', Star], ['Reviews', metrics.reviewsTotal, 'reviews', MessageSquare], ['Hidden reviews', metrics.reviewsHidden, 'reviews', EyeOff], ['Claims pending', metrics.claimsPending, 'claims', BadgeCheck], ['Businesses pending', metrics.businessesPending, 'businesses', Building2], ['Open reports', metrics.reportsOpen, 'reports', Flag], ['Users', metrics.usersApprox, 'users', Users], ['Categories', (metrics as { categoriesTotal?: number }).categoriesTotal ?? categories.length, 'categories', Tags], ['Transport', (metrics as { transportTotal?: number }).transportTotal ?? 0, 'transport', Bus]] as [string, number, Tab, typeof MapPin][]).map(([label, value, jump, Icon]) => (
                  <button key={label} type="button" onClick={() => setTab(jump)} className="text-left">
                    <Card className="transition hover:border-sky-300 hover:shadow-sm">
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-lg bg-sky-50 p-2 dark:bg-sky-950"><Icon className="h-4 w-4 text-sky-600" /></div>
                        <div><p className="text-xs text-slate-400">{label}</p><p className="text-2xl font-bold tabular-nums">{value}</p></div>
                      </CardContent>
                    </Card>
                  </button>
                ))}
              </div>
              <Card>
                <CardContent className="p-4">
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold"><AlertTriangle className="h-4 w-4 text-amber-500" /> Priority queue</h2>
                  {queueTotal === 0 ? <p className="text-sm text-slate-500">All clear — nothing pending moderation.</p> : (
                    <ul className="space-y-2 text-sm">
                      {(metrics.placesPending ?? 0) > 0 && <li className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950/40"><span>{metrics.placesPending} places awaiting publish</span><Button size="sm" variant="outline" onClick={() => { setTab('places'); setPlaceStatusFilter('pending') }}>Review</Button></li>}
                      {(metrics.claimsPending ?? 0) > 0 && <li className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950/40"><span>{metrics.claimsPending} ownership claims</span><Button size="sm" variant="outline" onClick={() => setTab('claims')}>Review</Button></li>}
                      {(metrics.businessesPending ?? 0) > 0 && <li className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950/40"><span>{metrics.businessesPending} business registrations</span><Button size="sm" variant="outline" onClick={() => setTab('businesses')}>Review</Button></li>}
                      {(metrics.reportsOpen ?? 0) > 0 && <li className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2 dark:bg-rose-950/40"><span>{metrics.reportsOpen} open reports</span><Button size="sm" variant="outline" onClick={() => setTab('reports')}>Review</Button></li>}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {tab === 'places' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex min-w-[12rem] flex-1 items-center gap-2 rounded-lg border px-2 dark:border-slate-700">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input value={placeQ} onChange={(e) => setPlaceQ(e.target.value)} placeholder="Search name, address, notes…" className="w-full bg-transparent py-2 text-sm outline-none" />
                </div>
                <select value={placeStatusFilter} onChange={(e) => setPlaceStatusFilter(e.target.value as typeof placeStatusFilter)} className="rounded-lg border px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
                  <option value="all">All status</option><option value="pending">Pending</option><option value="published">Published</option><option value="archived">Archived</option><option value="draft">Draft</option>
                </select>
                <select value={placeCategoryFilter} onChange={(e) => setPlaceCategoryFilter(e.target.value)} className="rounded-lg border px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
                  <option value="all">All categories</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <Button size="sm" variant={showDeleted ? 'default' : 'outline'} onClick={() => setShowDeleted((v) => !v)}>{showDeleted ? 'Showing deleted' : 'Show deleted'}</Button>
                <Button size="sm" onClick={() => { setShowCreate(true); if (!cCategory && categories[0]) setCCategory(categories[0].id) }}><Plus className="h-3.5 w-3.5" /> New place</Button>
              </div>

              {showCreate && (
                <Card className="border-sky-200 dark:border-sky-900"><CardContent className="space-y-3 p-4">
                  <p className="text-sm font-semibold text-sky-800 dark:text-sky-200">Create place</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><label className="mb-1 block text-xs text-slate-500">Name *</label><input className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={cName} onChange={(e) => { setCName(e.target.value); if (!cSlug || cSlug === slugify(cName)) setCSlug(slugify(e.target.value)) }} /></div>
                    <div><label className="mb-1 block text-xs text-slate-500">Slug</label><input className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={cSlug} onChange={(e) => setCSlug(e.target.value)} /></div>
                    <div><label className="mb-1 block text-xs text-slate-500">Category *</label><select className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={cCategory} onChange={(e) => setCCategory(e.target.value)}><option value="">Select…</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    <div><label className="mb-1 block text-xs text-slate-500">Status</label><select className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={cStatus} onChange={(e) => setCStatus(e.target.value)}><option value="draft">draft</option><option value="pending">pending</option><option value="published">published</option></select></div>
                    <div><label className="mb-1 block text-xs text-slate-500">Latitude</label><input className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={cLat} onChange={(e) => setCLat(e.target.value)} type="number" step="any" /></div>
                    <div><label className="mb-1 block text-xs text-slate-500">Longitude</label><input className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={cLng} onChange={(e) => setCLng(e.target.value)} type="number" step="any" /></div>
                    <div className="sm:col-span-2"><label className="mb-1 block text-xs text-slate-500">Address</label><input className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={cAddress} onChange={(e) => setCAddress(e.target.value)} /></div>
                    <div className="sm:col-span-2"><label className="mb-1 block text-xs text-slate-500">Short description</label><input className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={cDesc} onChange={(e) => setCDesc(e.target.value)} /></div>
                  </div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={cVerified} onChange={(e) => setCVerified(e.target.checked)} /> Verified</label>
                  <div className="flex gap-2"><Button size="sm" disabled={actions.placeCreate.isPending} onClick={submitCreate}>{actions.placeCreate.isPending ? 'Creating…' : 'Create place'}</Button><Button size="sm" variant="outline" onClick={resetCreate}>Cancel</Button></div>
                </CardContent></Card>
              )}

              {selected.size > 0 && (
                <div className="flex flex-wrap gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm dark:bg-sky-950/40">
                  <span className="font-medium">{selected.size} selected</span>
                  <Button size="sm" onClick={() => run(() => actions.bulkPlaces.mutateAsync({ placeIds: [...selected], status: 'published', verified: true }), `Published ${selected.size}`).then(() => setSelected(new Set()))}>Bulk publish</Button>
                  <Button size="sm" variant="outline" onClick={() => run(() => actions.bulkPlaces.mutateAsync({ placeIds: [...selected], status: 'archived' }), `Archived ${selected.size}`).then(() => setSelected(new Set()))}>Bulk archive</Button>
                  <Button size="sm" variant="outline" className="text-red-600" onClick={() => { if (!window.confirm(`Soft-delete ${selected.size}?`)) return; run(() => actions.bulkDelete.mutateAsync([...selected]), 'Deleted').then(() => setSelected(new Set())) }}>Bulk delete</Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
                </div>
              )}

              <p className="text-xs text-slate-400">{filteredPlaces.length} places</p>
              {placesLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {filteredPlaces.map((p) => (
                <Card key={p.id}><CardContent className="p-3">
                  <div className="flex flex-wrap items-start gap-2">
                    <input type="checkbox" className="mt-1" checked={selected.has(p.id)} onChange={() => setSelected((prev) => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n })} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/places/${p.slug}`} className="text-sm font-medium hover:text-sky-600">{p.name}</Link>
                        <StatusBadge status={p.status ?? 'draft'} />
                        {p.verified && <span className="text-[10px] font-semibold text-sky-600">VERIFIED</span>}
                        {p.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                        {p.deleted_at && <span className="text-[10px] font-bold text-red-600">DELETED</span>}
                      </div>
                      <p className="text-xs text-slate-400">{p.category?.name ?? '—'} · {relativeTime(p.updated_at)}{p.address ? ` · ${p.address}` : ''}</p>
                      {p.staff_notes && <p className="mt-1 text-xs italic text-slate-500">Note: {p.staff_notes}</p>}
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
                      <Button size="sm" variant="ghost" className="text-xs text-red-700" onClick={() => { if (!window.confirm(`PERMANENTLY delete "${p.name}"?`)) return; run(() => actions.placeHardDelete.mutateAsync(p.id), 'Permanently deleted') }}>Hard del</Button>
                    </div>
                  </div>
                  {editingPlaceId === p.id && (
                    <div className="mt-3">
                      <PlaceEditor place={p} categories={categories} saving={actions.placeUpdate.isPending} onCancel={() => setEditingPlaceId(null)} onSave={async (data) => { await run(() => actions.placeUpdate.mutateAsync({ placeId: p.id, data }), 'Place updated'); setEditingPlaceId(null) }} />
                    </div>
                  )}
                </CardContent></Card>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <div className="flex min-w-[12rem] flex-1 items-center gap-2 rounded-lg border px-2 dark:border-slate-700"><Search className="h-4 w-4 text-slate-400" /><input value={reviewQ} onChange={(e) => setReviewQ(e.target.value)} placeholder="Search reviews…" className="w-full bg-transparent py-2 text-sm outline-none" /></div>
                <select value={reviewStatusFilter} onChange={(e) => setReviewStatusFilter(e.target.value as typeof reviewStatusFilter)} className="rounded-lg border px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"><option value="all">All status</option><option value="published">Published</option><option value="pending">Pending</option><option value="hidden">Hidden</option></select>
              </div>
              {selectedReviews.size > 0 && (
                <div className="flex flex-wrap gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm dark:bg-sky-950/40">
                  <span className="font-medium">{selectedReviews.size} selected</span>
                  <Button size="sm" onClick={() => run(() => actions.bulkReviews.mutateAsync({ reviewIds: [...selectedReviews], status: 'published' }), 'Published').then(() => setSelectedReviews(new Set()))}>Bulk publish</Button>
                  <Button size="sm" variant="outline" onClick={() => run(() => actions.bulkReviews.mutateAsync({ reviewIds: [...selectedReviews], status: 'hidden' }), 'Hidden').then(() => setSelectedReviews(new Set()))}>Bulk hide</Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedReviews(new Set())}>Clear</Button>
                </div>
              )}
              {reviewsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {filteredReviews.map((r) => {
                const place = (r as { place?: { name?: string; slug?: string } }).place
                return (
                  <Card key={r.id}><CardContent className="p-3">
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
                      <input type="checkbox" checked={selectedReviews.has(r.id)} onChange={() => setSelectedReviews((prev) => { const n = new Set(prev); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n })} />
                      <span className="font-medium">{r.profile?.full_name || 'User'}</span>
                      <span className="text-amber-600">{r.rating}★</span>
                      <StatusBadge status={r.status} />
                      {place?.name && <Link to={`/places/${place.slug}`} className="text-xs text-sky-600 hover:underline">{place.name}</Link>}
                      <span className="text-xs text-slate-400">{relativeTime(r.created_at)}</span>
                    </div>
                    {r.title && <p className="text-sm font-medium">{r.title}</p>}
                    <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {r.status !== 'published' && <Button size="sm" variant="outline" onClick={() => run(() => actions.reviewStatus.mutateAsync({ reviewId: r.id, status: 'published' }), 'Published')}><Eye className="h-3.5 w-3.5" /> Publish</Button>}
                      {r.status !== 'hidden' && <Button size="sm" variant="ghost" onClick={() => run(() => actions.reviewStatus.mutateAsync({ reviewId: r.id, status: 'hidden' }), 'Hidden')}><EyeOff className="h-3.5 w-3.5" /> Hide</Button>}
                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => { if (!window.confirm('Delete this review permanently?')) return; run(() => actions.reviewDelete.mutateAsync(r.id), 'Review deleted') }}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                    </div>
                  </CardContent></Card>
                )
              })}
            </div>
          )}

          {tab === 'claims' && (
            <div className="space-y-2">
              {claimsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {!claimsLoading && claims.length === 0 && <p className="text-sm text-slate-500">No pending claims.</p>}
              {claims.map((c) => (
                <Card key={c.id}><CardContent className="p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{c.place?.name ?? c.place_id}</p>
                      {c.place?.address && <p className="text-xs text-slate-400">{c.place.address}</p>}
                      {c.message && <p className="mt-1 text-sm text-slate-600">{c.message}</p>}
                      <p className="mt-1 text-xs text-slate-400">{relativeTime(c.created_at)}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={() => run(() => actions.claim.mutateAsync({ claimId: c.id, approve: true }), 'Approved')}><Check className="h-3.5 w-3.5" /> Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => run(() => actions.claim.mutateAsync({ claimId: c.id, approve: false }), 'Rejected')}><X className="h-3.5 w-3.5" /> Reject</Button>
                    {c.place?.slug && <Link to={`/places/${c.place.slug}`}><Button size="sm" variant="ghost">View place</Button></Link>}
                  </div>
                </CardContent></Card>
              ))}
            </div>
          )}

          {tab === 'businesses' && (
            <div className="space-y-2">
              <select value={bizStatusFilter} onChange={(e) => setBizStatusFilter(e.target.value as typeof bizStatusFilter)} className="rounded-lg border px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"><option value="all">All</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="suspended">Suspended</option></select>
              {bizLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {filteredBusinesses.map((b) => (
                <Card key={b.id}><CardContent className="p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{b.business_name}</p>
                      <p className="text-xs text-slate-400">{b.contact_name} · {b.email || b.phone || '—'}{b.city ? ` · ${b.city}` : ''}</p>
                      {b.description && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{b.description}</p>}
                      <p className="mt-1 text-xs text-slate-400">{relativeTime(b.created_at)}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {b.status !== 'approved' && <Button size="sm" onClick={() => run(() => actions.business.mutateAsync({ businessId: b.id, status: 'approved' }), 'Approved')}><Check className="h-3.5 w-3.5" /> Approve</Button>}
                    {b.status !== 'suspended' && <Button size="sm" variant="outline" onClick={() => run(() => actions.business.mutateAsync({ businessId: b.id, status: 'suspended' }), 'Suspended')}>Suspend</Button>}
                    {b.status !== 'pending' && <Button size="sm" variant="ghost" onClick={() => run(() => actions.business.mutateAsync({ businessId: b.id, status: 'pending' }), 'Set pending')}>Set pending</Button>}
                  </div>
                </CardContent></Card>
              ))}
            </div>
          )}

          {tab === 'reports' && (
            <div className="space-y-2">
              <select value={reportStatusFilter} onChange={(e) => setReportStatusFilter(e.target.value as typeof reportStatusFilter)} className="rounded-lg border px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"><option value="open">Open</option><option value="resolved">Resolved</option><option value="dismissed">Dismissed</option><option value="all">All</option></select>
              {reportsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {filteredReports.map((r) => (
                <Card key={r.id}><CardContent className="p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">Reason: {r.reason}</p>
                    <StatusBadge status={r.status ?? 'open'} />
                    <span className="text-xs text-slate-400">{relativeTime(r.created_at)}</span>
                  </div>
                  {r.details && <p className="mt-1 text-sm text-slate-600">{r.details}</p>}
                  {r.review && <p className="mt-1 line-clamp-2 text-sm text-slate-600">Review ({r.review.rating}★){r.review.place?.name ? ` on ${r.review.place.name}` : ''}: {r.review.comment}</p>}
                  {r.reporter && <p className="mt-1 text-xs text-slate-400">Reporter: {r.reporter.full_name || r.reporter.email || '—'}</p>}
                  {(r.status === 'open' || !r.status) && (
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={() => run(() => actions.report.mutateAsync({ reportId: r.id, status: 'resolved' }), 'Resolved')}>Resolve</Button>
                      <Button size="sm" variant="outline" onClick={() => run(() => actions.report.mutateAsync({ reportId: r.id, status: 'dismissed' }), 'Dismissed')}>Dismiss</Button>
                    </div>
                  )}
                </CardContent></Card>
              ))}
            </div>
          )}

          {tab === 'users' && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <div className="flex min-w-[12rem] flex-1 items-center gap-2 rounded-lg border px-2 dark:border-slate-700"><Search className="h-4 w-4 text-slate-400" /><input value={userQ} onChange={(e) => setUserQ(e.target.value)} placeholder="Search users…" className="w-full bg-transparent py-2 text-sm outline-none" /></div>
                <select value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)} className="rounded-lg border px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"><option value="all">All roles</option>{PROFILE_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}</select>
              </div>
              {usersLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {filteredUsers.map((u) => (
                <Card key={u.id}><CardContent className="flex flex-wrap items-center gap-3 p-3">
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium">{u.full_name || 'Unnamed'}</p><p className="text-xs text-slate-400">{u.email || u.id} · joined {relativeTime(u.created_at)}</p></div>
                  <StatusBadge status={u.role || 'visitor'} />
                  <select value={u.role || 'visitor'} disabled={u.id === user?.id} onChange={(e) => { const role = e.target.value; if (!window.confirm(`Set role to "${role}"?`)) { e.target.value = u.role; return }; run(() => actions.userRole.mutateAsync({ userId: u.id, role }), `Role → ${role}`) }} className="rounded-lg border px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950">{PROFILE_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}</select>
                </CardContent></Card>
              ))}
            </div>
          )}

          {tab === 'categories' && (
            <div className="space-y-3">
              <Button size="sm" onClick={() => setShowCatCreate((v) => !v)}><Plus className="h-3.5 w-3.5" /> {showCatCreate ? 'Cancel' : 'New category'}</Button>
              {showCatCreate && (
                <Card className="border-sky-200 dark:border-sky-900"><CardContent className="space-y-3 p-4">
                  <p className="text-sm font-semibold">Create category</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Name" value={catName} onChange={(e) => { setCatName(e.target.value); if (!catSlug || catSlug === slugify(catName)) setCatSlug(slugify(e.target.value)) }} />
                    <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="slug" value={catSlug} onChange={(e) => setCatSlug(e.target.value)} />
                    <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Icon (e.g. Hotel)" value={catIcon} onChange={(e) => setCatIcon(e.target.value)} />
                    <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" type="number" placeholder="Sort order" value={catSort} onChange={(e) => setCatSort(e.target.value)} />
                  </div>
                  <Button size="sm" disabled={actions.categoryCreate.isPending || !catName.trim()} onClick={() => run(() => actions.categoryCreate.mutateAsync({ name: catName, slug: catSlug || slugify(catName), icon: catIcon || null, sort_order: Number(catSort) || 50 }), 'Category created').then(() => { setCatName(''); setCatSlug(''); setCatIcon(''); setShowCatCreate(false) })}>{actions.categoryCreate.isPending ? 'Saving…' : 'Create'}</Button>
                </CardContent></Card>
              )}
              {categories.length === 0 && <p className="text-sm text-slate-500">No categories. Run seed.sql or create one.</p>}
              {categories.map((c) => (
                <Card key={c.id}><CardContent className="p-3">
                  {editingCatId === c.id ? (
                    <div className="space-y-2">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue={c.name} id={`cat-name-${c.id}`} />
                        <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue={c.slug} id={`cat-slug-${c.id}`} />
                        <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue={c.icon ?? ''} id={`cat-icon-${c.id}`} placeholder="Icon" />
                        <input className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" type="number" defaultValue={c.sort_order} id={`cat-sort-${c.id}`} />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => { const name = (document.getElementById(`cat-name-${c.id}`) as HTMLInputElement)?.value; const slug = (document.getElementById(`cat-slug-${c.id}`) as HTMLInputElement)?.value; const icon = (document.getElementById(`cat-icon-${c.id}`) as HTMLInputElement)?.value; const sort_order = Number((document.getElementById(`cat-sort-${c.id}`) as HTMLInputElement)?.value); run(() => actions.categoryUpdate.mutateAsync({ id: c.id, data: { name, slug, icon: icon || null, sort_order } }), 'Category updated').then(() => setEditingCatId(null)) }}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingCatId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="min-w-0 flex-1"><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-slate-400">{c.slug} · sort {c.sort_order}{c.icon ? ` · ${c.icon}` : ''}</p></div>
                      <Button size="sm" variant="ghost" onClick={() => setEditingCatId(c.id)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => { if (!window.confirm(`Delete category "${c.name}"? Places using it may fail.`)) return; run(() => actions.categoryDelete.mutateAsync(c.id), 'Deleted') }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  )}
                </CardContent></Card>
              ))}
            </div>
          )}

          {tab === 'transport' && (
            <div className="space-y-2">
              {transportLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {!transportLoading && transportList.length === 0 && <p className="text-sm text-slate-500">No transport services. Run seed.sql or add via SQL.</p>}
              {transportList.map((tr) => (
                <Card key={tr.id}><CardContent className="p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{tr.provider_name}</p>
                      <p className="text-xs text-slate-400">{tr.service_type}{tr.estimated_price_min != null || tr.estimated_price_max != null ? ` · ${tr.estimated_price_min ?? '?'}–${tr.estimated_price_max ?? '?'} ${tr.currency || 'ETB'}` : ''}{tr.phone ? ` · ${tr.phone}` : ''}</p>
                      {tr.route_description && <p className="mt-1 text-sm text-slate-600">{tr.route_description}</p>}
                    </div>
                    <StatusBadge status={tr.verified ? 'approved' : 'pending'} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button size="sm" variant={tr.verified ? 'outline' : 'default'} onClick={() => run(() => actions.transportVerified.mutateAsync({ id: tr.id, verified: !tr.verified }), tr.verified ? 'Unverified' : 'Verified')}>{tr.verified ? 'Unverify' : 'Verify'}</Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
