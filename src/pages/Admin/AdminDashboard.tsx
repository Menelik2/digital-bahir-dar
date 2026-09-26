import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Shield,
  Loader2,
  MapPin,
  MessageSquare,
  Building2,
  Flag,
  LayoutDashboard,
  Check,
  EyeOff,
  BadgeCheck,
  Users,
  Download,
  Star,
  RefreshCw,
  Clock,
  Tags,
  Bus,
  CalendarDays,
  Activity,
  Search,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import {
  useIsStaff,
  useAdminMetrics,
  useModerationPlaces,
  useModerationReviews,
  usePendingClaims,
  usePendingBusinesses,
  useOpenReports,
  useAdminUsers,
  useAdminActions,
  useAdminActivity,
} from '@/hooks/useAdmin'
import { downloadCsv, PROFILE_ROLES } from '@/services/admin'
import { EventsCmsPanel } from '@/components/admin/EventsCmsPanel'
import { TripsCmsPanel } from '@/components/admin/TripsCmsPanel'
import { CategoriesCmsPanel } from '@/components/admin/CategoriesCmsPanel'
import { TransportCmsPanel } from '@/components/admin/TransportCmsPanel'
import { cn } from '@/lib/utils'

type Tab =
  | 'metrics'
  | 'places'
  | 'reviews'
  | 'claims'
  | 'businesses'
  | 'reports'
  | 'users'
  | 'categories'
  | 'transport'
  | 'events'
  | 'trips'

const TAB_IDS: Tab[] = [
  'metrics',
  'places',
  'reviews',
  'claims',
  'businesses',
  'reports',
  'users',
  'categories',
  'events',
  'trips',
  'transport',
]

function isTab(v: string | null): v is Tab {
  return !!v && (TAB_IDS as string[]).includes(v)
}

export default function AdminDashboard() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { data: staff, isLoading: roleLoading } = useIsStaff()
  const isStaff = !!staff?.isStaff
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [tab, setTabState] = useState<Tab>(isTab(tabParam) ? tabParam : 'metrics')
  const [banner, setBanner] = useState<string | null>(null)
  const [placeQ, setPlaceQ] = useState('')
  const [placeStatus, setPlaceStatus] = useState<'all' | 'pending' | 'published' | 'draft' | 'archived'>('all')
  const [reviewQ, setReviewQ] = useState('')
  const [userQ, setUserQ] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const setTab = useCallback(
    (id: Tab) => {
      setTabState(id)
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (id === 'metrics') next.delete('tab')
          else next.set('tab', id)
          return next
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  useEffect(() => {
    if (isTab(tabParam) && tabParam !== tab) setTabState(tabParam)
  }, [tabParam, tab])

  const { data: metrics, refetch: refetchMetrics, isFetching: metricsFetching, isLoading: metricsLoading } =
    useAdminMetrics(isStaff)
  const {
    data: places = [],
    isLoading: placesLoading,
    refetch: refetchPlaces,
  } = useModerationPlaces(isStaff && tab === 'places')
  const { data: reviews = [], isLoading: reviewsLoading } = useModerationReviews(isStaff && tab === 'reviews')
  const { data: claims = [], isLoading: claimsLoading } = usePendingClaims(isStaff && tab === 'claims')
  const { data: businesses = [], isLoading: bizLoading } = usePendingBusinesses(isStaff && tab === 'businesses')
  const { data: reports = [], isLoading: reportsLoading } = useOpenReports(isStaff && tab === 'reports')
  const { data: users = [], isLoading: usersLoading } = useAdminUsers(isStaff && tab === 'users')
  const { data: activity = [], isLoading: activityLoading } = useAdminActivity(isStaff && tab === 'metrics')
  const actions = useAdminActions()

  const flash = (msg: string) => {
    setBanner(msg)
    window.setTimeout(() => setBanner(null), 3500)
  }

  const run = async (id: string | null, fn: () => Promise<unknown>, okMsg?: string) => {
    try {
      setBusyId(id)
      await fn()
      if (okMsg) flash(okMsg)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Action failed — check RLS / staff role'
      flash(`Error: ${msg}`)
      console.error(msg)
    } finally {
      setBusyId(null)
    }
  }

  const queueTotal =
    (metrics?.placesPending ?? 0) +
    (metrics?.claimsPending ?? 0) +
    (metrics?.businessesPending ?? 0) +
    (metrics?.reportsOpen ?? 0)

  const filteredPlaces = useMemo(() => {
    const q = placeQ.trim().toLowerCase()
    return places.filter((p) => {
      if (placeStatus !== 'all' && p.status !== placeStatus) return false
      if (!q) return true
      return `${p.name} ${p.address ?? ''} ${p.status}`.toLowerCase().includes(q)
    })
  }, [places, placeQ, placeStatus])

  const filteredReviews = useMemo(() => {
    const q = reviewQ.trim().toLowerCase()
    if (!q) return reviews
    return reviews.filter((r) =>
      `${(r as { comment?: string; body?: string }).comment ?? (r as { body?: string }).body ?? ''} ${r.status} ${r.rating}`.toLowerCase().includes(q)
    )
  }, [reviews, reviewQ])

  const filteredUsers = useMemo(() => {
    const q = userQ.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) =>
      `${u.full_name ?? ''} ${u.email ?? ''} ${u.role ?? ''}`.toLowerCase().includes(q)
    )
  }, [users, userQ])

  if (authLoading || roleLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

  if (!isAuthenticated || !isStaff) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Shield className="mx-auto mb-4 h-12 w-12 text-slate-400" />
        <h1 className="text-xl font-semibold">Staff access required</h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in with a staff account (admin or moderator) to manage the city platform.
        </p>
        <div className="mt-6">
          <Link
            to="/auth"
            className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: 'metrics', label: 'Overview', icon: LayoutDashboard },
    { id: 'places', label: 'Places', icon: MapPin, badge: metrics?.placesPending },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, badge: metrics?.reviewsPending },
    { id: 'claims', label: 'Claims', icon: BadgeCheck, badge: metrics?.claimsPending },
    { id: 'businesses', label: 'Business', icon: Building2, badge: metrics?.businessesPending },
    { id: 'reports', label: 'Reports', icon: Flag, badge: metrics?.reportsOpen },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'trips', label: 'Trips', icon: Activity },
    { id: 'transport', label: 'Transport', icon: Bus, badge: metrics?.transportTotal },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {banner && (
        <div
          className={cn(
            'fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg',
            banner.startsWith('Error') ? 'bg-rose-600' : 'bg-emerald-600'
          )}
        >
          {banner}
        </div>
      )}

      <header className="border-b bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-sky-600" />
            <div>
              <h1 className="text-lg font-semibold leading-tight">Admin</h1>
              <p className="text-xs text-slate-500">
                Digital Bahir Dar · {staff?.role || 'staff'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {queueTotal > 0 && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                {queueTotal} in queue
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                void refetchMetrics()
                void refetchPlaces()
              }}
              disabled={metricsFetching}
            >
              <RefreshCw className={cn('h-3.5 w-3.5', metricsFetching && 'animate-spin')} />
            </Button>
            {metrics && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  downloadCsv('admin-metrics.csv', [
                    ['metric', 'value'],
                    ...Object.entries(metrics).map(([k, v]) => [k, String(v)]),
                  ])
                }
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row">
        <nav className="flex shrink-0 gap-1 overflow-x-auto lg:w-48 lg:flex-col lg:overflow-visible">
          {tabs.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm whitespace-nowrap transition-colors',
                  active
                    ? 'bg-sky-100 font-medium text-sky-900 dark:bg-sky-900/40 dark:text-sky-100'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{t.label}</span>
                {t.badge != null && t.badge > 0 && (
                  <span className="rounded-full bg-sky-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {t.badge > 99 ? '99+' : t.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <main className="min-w-0 flex-1">
          {tab === 'metrics' && (
            <div className="space-y-4">
              {metricsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {metrics && (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {[
                      { label: 'Places', value: metrics.placesTotal, sub: `${metrics.placesPending ?? 0} pending` },
                      { label: 'Published', value: metrics.placesPublished, sub: `${metrics.placesDraft ?? 0} draft` },
                      { label: 'Reviews', value: metrics.reviewsTotal, sub: `${metrics.reviewsHidden ?? 0} hidden` },
                      { label: 'Claims', value: metrics.claimsPending, sub: 'awaiting review' },
                      { label: 'Businesses', value: metrics.businessesPending, sub: 'pending' },
                      { label: 'Reports', value: metrics.reportsOpen, sub: 'open' },
                      { label: 'Featured', value: metrics.placesFeatured, sub: 'places' },
                      { label: 'Categories', value: metrics.categoriesTotal, sub: 'active' },
                      { label: 'Transport', value: metrics.transportTotal, sub: 'services' },
                    ].map((m) => (
                      <Card key={m.label}>
                        <CardContent className="p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{m.label}</p>
                          <p className="mt-1 text-2xl font-semibold tabular-nums">{m.value ?? '—'}</p>
                          <p className="text-xs text-slate-400">{m.sub}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-medium">Recent activity</h2>
                        <Clock className="h-4 w-4 text-slate-400" />
                      </div>
                      {activityLoading && <Loader2 className="h-5 w-5 animate-spin text-sky-500" />}
                      <ul className="space-y-2 text-sm">
                        {(activity ?? []).slice(0, 12).map(
                          (a: { id: string; action?: string; entity_type?: string; created_at?: string }) => (
                            <li
                              key={a.id}
                              className="flex justify-between gap-2 border-b border-slate-100 pb-2 last:border-0 dark:border-slate-800"
                            >
                              <span>
                                <span className="font-medium">{a.action || 'action'}</span>
                                {a.entity_type ? (
                                  <span className="text-slate-500"> · {a.entity_type}</span>
                                ) : null}
                              </span>
                              <span className="shrink-0 text-xs text-slate-400">
                                {a.created_at ? new Date(a.created_at).toLocaleString() : ''}
                              </span>
                            </li>
                          )
                        )}
                        {!activityLoading && (activity ?? []).length === 0 && (
                          <li className="text-slate-500">No recent staff activity logged.</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setTab('places')}>
                      Moderate places
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setTab('transport')}>
                      Manage transport
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setTab('trips')}>
                      Trip planner CMS
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setTab('categories')}>
                      Categories
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === 'places' && (
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={placeQ}
                    onChange={(e) => setPlaceQ(e.target.value)}
                    placeholder="Search places…"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
                <select
                  value={placeStatus}
                  onChange={(e) => setPlaceStatus(e.target.value as typeof placeStatus)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const rows = [
                      ['id', 'name', 'status', 'verified', 'featured', 'address'],
                      ...filteredPlaces.map((p) => [
                        p.id,
                        p.name,
                        p.status,
                        p.verified ? 'yes' : 'no',
                        p.featured ? 'yes' : 'no',
                        p.address ?? '',
                      ]),
                    ]
                    downloadCsv('places-moderation.csv', rows)
                  }}
                >
                  <Download className="h-3.5 w-3.5" /> CSV
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Showing {filteredPlaces.length} of {places.length}
              </p>
              {placesLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {!placesLoading && filteredPlaces.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-500">No places match your filters.</p>
              )}
              {filteredPlaces.map((p) => (
                <Card key={p.id}>
                  <CardContent className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {p.name}
                        {p.featured && (
                          <Star className="ml-1 inline h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                        )}
                      </p>
                      <p className="text-xs text-slate-500">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium uppercase dark:bg-slate-800">
                          {p.status}
                        </span>
                        {p.verified ? ' · verified' : ' · unverified'} · {p.address || 'No address'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Button
                        size="sm"
                        disabled={busyId === p.id}
                        onClick={() =>
                          void run(
                            p.id,
                            () =>
                              actions.placeStatus.mutateAsync({
                                placeId: p.id,
                                status: 'published',
                                verified: true,
                              }),
                            'Published'
                          )
                        }
                      >
                        <Check className="h-3.5 w-3.5" /> Publish
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === p.id}
                        onClick={() =>
                          void run(
                            p.id,
                            () => actions.placeStatus.mutateAsync({ placeId: p.id, status: 'archived' }),
                            'Archived'
                          )
                        }
                      >
                        <EyeOff className="h-3.5 w-3.5" /> Archive
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === p.id}
                        onClick={() =>
                          void run(
                            p.id,
                            () =>
                              actions.placeFeatured.mutateAsync({
                                placeId: p.id,
                                featured: !p.featured,
                              }),
                            p.featured ? 'Unfeatured' : 'Featured'
                          )
                        }
                      >
                        <Star className={cn('h-3.5 w-3.5', p.featured && 'fill-amber-400 text-amber-500')} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-rose-600"
                        disabled={busyId === p.id}
                        onClick={() => {
                          if (!window.confirm(`Soft-delete “${p.name}”?`)) return
                          void run(p.id, () => actions.placeSoftDelete.mutateAsync(p.id), 'Deleted')
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={reviewQ}
                  onChange={(e) => setReviewQ(e.target.value)}
                  placeholder="Search reviews…"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              {reviewsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {filteredReviews.map((r) => (
                <Card key={r.id}>
                  <CardContent className="p-3">
                    <p className="text-sm">{(r as { comment?: string; body?: string }).comment || (r as { body?: string }).body || '(no text)'}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Rating {r.rating} · {r.status}
                    </p>
                    <div className="mt-2 flex gap-2">
                      {r.status !== 'published' && (
                        <Button
                          size="sm"
                          disabled={busyId === r.id}
                          onClick={() =>
                            void run(
                              r.id,
                              () =>
                                actions.reviewStatus.mutateAsync({
                                  reviewId: r.id,
                                  status: 'published',
                                }),
                              'Published'
                            )
                          }
                        >
                          Publish
                        </Button>
                      )}
                      {r.status !== 'hidden' && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === r.id}
                          onClick={() =>
                            void run(
                              r.id,
                              () =>
                                actions.reviewStatus.mutateAsync({ reviewId: r.id, status: 'hidden' }),
                              'Hidden'
                            )
                          }
                        >
                          Hide
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!reviewsLoading && filteredReviews.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-500">No reviews to moderate.</p>
              )}
            </div>
          )}

          {tab === 'claims' && (
            <div className="space-y-3">
              {claimsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {claims.map((c) => (
                <Card key={c.id}>
                  <CardContent className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{c.place?.name || c.place_id}</p>
                      <p className="text-xs text-slate-500">{c.message || 'No message'}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="sm"
                        disabled={busyId === c.id}
                        onClick={() =>
                          void run(
                            c.id,
                            () => actions.claim.mutateAsync({ claimId: c.id, approve: true }),
                            'Approved'
                          )
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === c.id}
                        onClick={() =>
                          void run(
                            c.id,
                            () => actions.claim.mutateAsync({ claimId: c.id, approve: false }),
                            'Rejected'
                          )
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!claimsLoading && claims.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-500">No pending claims.</p>
              )}
            </div>
          )}

          {tab === 'businesses' && (
            <div className="space-y-3">
              {bizLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {businesses.map((b) => (
                <Card key={b.id}>
                  <CardContent className="flex items-center justify-between gap-3 p-3">
                    <p className="text-sm font-medium">{b.business_name || 'Business'}</p>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        disabled={busyId === b.id}
                        onClick={() =>
                          void run(
                            b.id,
                            () =>
                              actions.business.mutateAsync({
                                businessId: b.id,
                                status: 'approved',
                              }),
                            'Approved'
                          )
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === b.id}
                        onClick={() =>
                          void run(
                            b.id,
                            () =>
                              actions.business.mutateAsync({
                                businessId: b.id,
                                status: 'suspended',
                              }),
                            'Suspended'
                          )
                        }
                      >
                        Suspend
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!bizLoading && businesses.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-500">No pending businesses.</p>
              )}
            </div>
          )}

          {tab === 'reports' && (
            <div className="space-y-3">
              {reportsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {reports.map((r) => (
                <Card key={r.id}>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">{r.reason}</p>
                    <p className="text-xs text-slate-500">{r.details}</p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        disabled={busyId === r.id}
                        onClick={() =>
                          void run(
                            r.id,
                            () => actions.report.mutateAsync({ reportId: r.id, status: 'resolved' }),
                            'Resolved'
                          )
                        }
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === r.id}
                        onClick={() =>
                          void run(
                            r.id,
                            () =>
                              actions.report.mutateAsync({ reportId: r.id, status: 'dismissed' }),
                            'Dismissed'
                          )
                        }
                      >
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!reportsLoading && reports.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-500">No open reports.</p>
              )}
            </div>
          )}

          {tab === 'users' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={userQ}
                  onChange={(e) => setUserQ(e.target.value)}
                  placeholder="Search name or email…"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              {usersLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {filteredUsers.slice(0, 80).map((u) => (
                <Card key={u.id}>
                  <CardContent className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{u.full_name || u.email}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-slate-500">
                      Role
                      <select
                        value={u.role || 'visitor'}
                        disabled={busyId === u.id || staff?.role !== 'admin'}
                        onChange={(e) => {
                          const role = e.target.value
                          if (role === u.role) return
                          if (!window.confirm(`Set ${u.email || u.full_name} to “${role}”?`)) {
                            e.target.value = u.role || 'visitor'
                            return
                          }
                          void run(
                            u.id,
                            () => actions.userRole.mutateAsync({ userId: u.id, role }),
                            `Role → ${role}`
                          )
                        }}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        {PROFILE_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </label>
                  </CardContent>
                </Card>
              ))}
              {!usersLoading && filteredUsers.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-500">No users found.</p>
              )}
              {staff?.role !== 'admin' && (
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Only admins can change user roles. You are signed in as {staff?.role}.
                </p>
              )}
            </div>
          )}

          {tab === 'categories' && <CategoriesCmsPanel />}
          {tab === 'events' && <EventsCmsPanel />}
          {tab === 'trips' && <TripsCmsPanel />}
          {tab === 'transport' && <TransportCmsPanel />}
        </main>
      </div>
    </div>
  )
}
