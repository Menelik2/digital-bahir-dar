import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Loader2, MapPin, MessageSquare, Building2, Flag, LayoutDashboard,
  Check, X, Eye, EyeOff, BadgeCheck, Users, Search, Download, Star, RefreshCw,
  AlertTriangle,
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
} from '@/hooks/useAdmin'
import { downloadCsv } from '@/services/admin'
import { cn } from '@/lib/utils'

type Tab = 'metrics' | 'places' | 'reviews' | 'claims' | 'businesses' | 'reports' | 'users'

export default function AdminPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth()
  const { data: staff, isLoading: roleLoading } = useIsStaff()
  const isStaff = !!staff?.isStaff
  const isAdmin = staff?.role === 'admin'
  const [tab, setTab] = useState<Tab>('metrics')
  const [placeQ, setPlaceQ] = useState('')
  const [placeStatusFilter, setPlaceStatusFilter] = useState<'all' | 'pending' | 'published' | 'hidden'>('all')
  const [reviewQ, setReviewQ] = useState('')
  const [userQ, setUserQ] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [banner, setBanner] = useState<string | null>(null)
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({})

  const { data: metrics, refetch: refetchMetrics, isFetching: metricsFetching } = useAdminMetrics(isStaff)
  const { data: places = [], isLoading: placesLoading, refetch: refetchPlaces } = useModerationPlaces(
    isStaff && (tab === 'places' || tab === 'metrics')
  )
  const { data: reviews = [], isLoading: reviewsLoading } = useModerationReviews(isStaff && tab === 'reviews')
  const { data: claims = [], isLoading: claimsLoading } = usePendingClaims(isStaff && tab === 'claims')
  const { data: businesses = [], isLoading: bizLoading } = usePendingBusinesses(isStaff && tab === 'businesses')
  const { data: reports = [], isLoading: reportsLoading } = useOpenReports(isStaff && tab === 'reports')
  const { data: users = [], isLoading: usersLoading } = useAdminUsers(isStaff && tab === 'users')
  const actions = useAdminActions()

  const filteredPlaces = useMemo(() => {
    let list = places
    if (placeStatusFilter !== 'all') list = list.filter((p) => p.status === placeStatusFilter)
    const q = placeQ.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q)
      )
    }
    return list
  }, [places, placeQ, placeStatusFilter])

  const filteredReviews = useMemo(() => {
    const q = reviewQ.trim().toLowerCase()
    if (!q) return reviews
    return reviews.filter(
      (r) =>
        r.comment?.toLowerCase().includes(q) ||
        r.title?.toLowerCase().includes(q) ||
        r.profile?.full_name?.toLowerCase().includes(q)
    )
  }, [reviews, reviewQ])

  const filteredUsers = useMemo(() => {
    const q = userQ.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        u.full_name?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    )
  }, [users, userQ])

  const queueTotal =
    (metrics?.placesPending ?? 0) +
    (metrics?.claimsPending ?? 0) +
    (metrics?.businessesPending ?? 0) +
    (metrics?.reportsOpen ?? 0)

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
        <p className="mb-4 text-slate-500">
          Your role is <strong>{staff?.role ?? 'visitor'}</strong>. Only <code>admin</code> or{' '}
          <code>moderator</code> can open this dashboard.
        </p>
        <p className="mb-6 rounded-lg bg-slate-100 p-3 text-left text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          Promote a user in Supabase SQL:
          <br />
          <code className="mt-1 block">UPDATE profiles SET role = &apos;admin&apos; WHERE email = &apos;you@example.com&apos;;</code>
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

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllFiltered = () => {
    setSelected(new Set(filteredPlaces.map((p) => p.id)))
  }

  const clearSelect = () => setSelected(new Set())

  const exportPlacesCsv = () => {
    const rows = [
      ['id', 'name', 'slug', 'status', 'verified', 'featured', 'address'],
      ...filteredPlaces.map((p) => [
        p.id,
        p.name,
        p.slug ?? '',
        p.status ?? '',
        String(!!p.verified),
        String(!!p.featured),
        p.address ?? '',
      ]),
    ]
    downloadCsv(`bahir-dar-places-${new Date().toISOString().slice(0, 10)}.csv`, rows)
    flash('CSV downloaded')
  }

  const exportMetricsCsv = () => {
    if (!metrics) return
    downloadCsv('bahir-dar-admin-metrics.csv', [
      ['metric', 'value'],
      ['places_total', String(metrics.placesTotal)],
      ['places_published', String(metrics.placesPublished)],
      ['places_pending', String(metrics.placesPending)],
      ['reviews_total', String(metrics.reviewsTotal)],
      ['reviews_hidden', String(metrics.reviewsHidden)],
      ['claims_pending', String(metrics.claimsPending)],
      ['businesses_pending', String(metrics.businessesPending)],
      ['reports_open', String(metrics.reportsOpen)],
      ['users_approx', String(metrics.usersApprox)],
    ])
    flash('Metrics CSV downloaded')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Shield className="h-7 w-7 text-sky-600" /> Admin
          </h1>
          <p className="text-sm text-slate-500">
            Signed in as <span className="font-medium capitalize">{staff?.role}</span>
            {queueTotal > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                {queueTotal} in queue
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              refetchMetrics()
              refetchPlaces()
              actions.invalidate()
              flash('Refreshed')
            }}
          >
            <RefreshCw className={cn('h-3.5 w-3.5', metricsFetching && 'animate-spin')} /> Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={exportMetricsCsv}>
            <Download className="h-3.5 w-3.5" /> Export metrics
          </Button>
        </div>
      </div>

      {banner && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
          {banner}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition',
              tab === t.id ? 'bg-white shadow dark:bg-slate-800' : 'text-slate-500'
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
            {t.badge != null && t.badge > 0 && (
              <span className="ml-0.5 rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'metrics' && metrics && (
        <div className="space-y-4">
          {queueTotal > 0 && (
            <Card className="border-amber-200 dark:border-amber-900">
              <CardContent className="flex flex-wrap items-center gap-3 p-4">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Moderation queue</p>
                  <p className="text-slate-500">
                    {metrics.placesPending} places · {metrics.claimsPending} claims ·{' '}
                    {metrics.businessesPending} businesses · {metrics.reportsOpen} reports
                  </p>
                </div>
                <Button size="sm" onClick={() => setTab(metrics.placesPending ? 'places' : metrics.claimsPending ? 'claims' : metrics.reportsOpen ? 'reports' : 'businesses')}>
                  Review queue
                </Button>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                ['Places total', metrics.placesTotal, 'places' as Tab],
                ['Published', metrics.placesPublished, 'places' as Tab],
                ['Places pending', metrics.placesPending, 'places' as Tab],
                ['Reviews', metrics.reviewsTotal, 'reviews' as Tab],
                ['Reviews hidden', metrics.reviewsHidden, 'reviews' as Tab],
                ['Claims pending', metrics.claimsPending, 'claims' as Tab],
                ['Businesses pending', metrics.businessesPending, 'businesses' as Tab],
                ['Open reports', metrics.reportsOpen, 'reports' as Tab],
                ['Users (approx)', metrics.usersApprox, 'users' as Tab],
              ] as [string, number, Tab][]
            ).map(([label, value, jump]) => (
              <button key={label} type="button" onClick={() => setTab(jump)} className="text-left">
                <Card className="transition hover:border-sky-300 dark:hover:border-sky-700">
                  <CardContent className="p-4">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-2xl font-bold">{value}</p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'places' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-2 dark:border-slate-700">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={placeQ}
                onChange={(e) => setPlaceQ(e.target.value)}
                placeholder="Search places…"
                className="w-full bg-transparent py-2 text-sm outline-none"
              />
            </div>
            <select
              value={placeStatusFilter}
              onChange={(e) => setPlaceStatusFilter(e.target.value as typeof placeStatusFilter)}
              className="rounded-lg border border-slate-200 bg-transparent px-2 py-2 text-sm dark:border-slate-700"
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
            </select>
            <Button size="sm" variant="outline" onClick={exportPlacesCsv}>
              <Download className="h-3.5 w-3.5" /> CSV
            </Button>
          </div>

          {selected.size > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm dark:bg-sky-950/40">
              <span className="font-medium">{selected.size} selected</span>
              <Button
                size="sm"
                onClick={() =>
                  run(
                    () =>
                      actions.bulkPlaces.mutateAsync({
                        placeIds: [...selected],
                        status: 'published',
                        verified: true,
                      }),
                    `Published ${selected.size} places`
                  ).then(clearSelect)
                }
              >
                Bulk publish
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  run(
                    () => actions.bulkPlaces.mutateAsync({ placeIds: [...selected], status: 'hidden' }),
                    `Hidden ${selected.size} places`
                  ).then(clearSelect)
                }
              >
                Bulk hide
              </Button>
              <Button size="sm" variant="ghost" onClick={clearSelect}>
                Clear
              </Button>
              <Button size="sm" variant="ghost" onClick={selectAllFiltered}>
                Select all filtered
              </Button>
            </div>
          )}

          {placesLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {!placesLoading && filteredPlaces.length === 0 && (
            <p className="text-sm text-slate-500">No places match (or RLS blocked / empty DB).</p>
          )}
          {filteredPlaces.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-3">
                <div className="flex flex-wrap items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={selected.has(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    aria-label={`Select ${p.name}`}
                  />
                  <div className="min-w-0 flex-1">
                    <Link to={`/places/${p.slug}`} className="text-sm font-medium hover:text-sky-600">
                      {p.name}
                    </Link>
                    <p className="text-xs text-slate-400">
                      {p.status}
                      {p.verified ? ' · verified' : ''}
                      {p.featured ? ' · featured' : ''}
                      {p.category && ` · ${typeof p.category === 'object' ? p.category.name : ''}`}
                    </p>
                    {p.address && <p className="text-xs text-slate-500">{p.address}</p>}
                    <div className="mt-2 flex gap-1">
                      <input
                        value={notesDraft[p.id] ?? (p as { staff_notes?: string }).staff_notes ?? ''}
                        onChange={(e) => setNotesDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                        placeholder="Staff notes…"
                        className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          run(
                            () =>
                              actions.placeNotes.mutateAsync({
                                placeId: p.id,
                                notes: notesDraft[p.id] ?? '',
                              }),
                            'Notes saved'
                          )
                        }
                      >
                        Save note
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        run(
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
                      variant="ghost"
                      onClick={() =>
                        run(
                          () => actions.placeStatus.mutateAsync({ placeId: p.id, status: 'hidden' }),
                          'Hidden'
                        )
                      }
                    >
                      <EyeOff className="h-3.5 w-3.5" /> Hide
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        run(
                          () =>
                            actions.placeFeatured.mutateAsync({
                              placeId: p.id,
                              featured: !p.featured,
                            }),
                          p.featured ? 'Unfeatured' : 'Featured'
                        )
                      }
                    >
                      <Star className={cn('h-3.5 w-3.5', p.featured && 'fill-amber-400 text-amber-400')} />
                    </Button>
                    {!p.verified && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          run(
                            () =>
                              actions.placeStatus.mutateAsync({
                                placeId: p.id,
                                status: p.status || 'published',
                                verified: true,
                              }),
                            'Verified'
                          )
                        }
                      >
                        <BadgeCheck className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 dark:border-slate-700">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={reviewQ}
              onChange={(e) => setReviewQ(e.target.value)}
              placeholder="Search reviews…"
              className="w-full bg-transparent py-2 text-sm outline-none"
            />
          </div>
          {reviewsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {!reviewsLoading && filteredReviews.length === 0 && (
            <p className="text-sm text-slate-500">No reviews yet.</p>
          )}
          {filteredReviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-3">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{r.profile?.full_name || 'User'}</span>
                  <span className="text-xs text-amber-600">{r.rating}★</span>
                  <span className="rounded bg-slate-100 px-1.5 text-[10px] uppercase dark:bg-slate-800">
                    {r.status}
                  </span>
                </div>
                {r.title && <p className="text-sm font-medium">{r.title}</p>}
                <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>
                <div className="mt-2 flex gap-2">
                  {r.status !== 'published' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        run(
                          () => actions.reviewStatus.mutateAsync({ reviewId: r.id, status: 'published' }),
                          'Review published'
                        )
                      }
                    >
                      <Eye className="h-3.5 w-3.5" /> Publish
                    </Button>
                  )}
                  {r.status !== 'hidden' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        run(
                          () => actions.reviewStatus.mutateAsync({ reviewId: r.id, status: 'hidden' }),
                          'Review hidden'
                        )
                      }
                    >
                      <EyeOff className="h-3.5 w-3.5" /> Hide
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'claims' && (
        <div className="space-y-2">
          {claimsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {!claimsLoading && claims.length === 0 && (
            <p className="text-sm text-slate-500">No pending claims.</p>
          )}
          {claims.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-3">
                <p className="text-sm font-medium">{c.place?.name ?? c.place_id}</p>
                <p className="text-xs text-slate-400">{c.place?.address}</p>
                {c.message && <p className="mt-1 text-sm text-slate-600">{c.message}</p>}
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      run(() => actions.claim.mutateAsync({ claimId: c.id, approve: true }), 'Claim approved')
                    }
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      run(() => actions.claim.mutateAsync({ claimId: c.id, approve: false }), 'Claim rejected')
                    }
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'businesses' && (
        <div className="space-y-2">
          {bizLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {!bizLoading && businesses.length === 0 && (
            <p className="text-sm text-slate-500">No pending business profiles.</p>
          )}
          {businesses.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-3">
                <p className="text-sm font-medium">{b.business_name}</p>
                <p className="text-xs text-slate-400">
                  {b.contact_name} · {b.email || b.phone}
                </p>
                {b.description && <p className="mt-1 text-sm text-slate-600">{b.description}</p>}
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      run(
                        () => actions.business.mutateAsync({ businessId: b.id, status: 'approved' }),
                        'Business approved'
                      )
                    }
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      run(
                        () => actions.business.mutateAsync({ businessId: b.id, status: 'suspended' }),
                        'Business suspended'
                      )
                    }
                  >
                    Suspend
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'reports' && (
        <div className="space-y-2">
          {reportsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {!reportsLoading && reports.length === 0 && (
            <p className="text-sm text-slate-500">No open review reports.</p>
          )}
          {reports.map(
            (r: { id: string; reason: string; details?: string; review?: { comment?: string; rating?: number } }) => (
              <Card key={r.id}>
                <CardContent className="p-3">
                  <p className="text-sm font-medium">Reason: {r.reason}</p>
                  {r.details && <p className="text-xs text-slate-500">{r.details}</p>}
                  {r.review && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                      Review ({r.review.rating}★): {r.review.comment}
                    </p>
                  )}
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        run(
                          () => actions.report.mutateAsync({ reportId: r.id, status: 'resolved' }),
                          'Report resolved'
                        )
                      }
                    >
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        run(
                          () => actions.report.mutateAsync({ reportId: r.id, status: 'dismissed' }),
                          'Report dismissed'
                        )
                      }
                    >
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-2">
          {!isAdmin && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              Role changes should be done carefully. Prefer admin accounts for promoting moderators.
            </p>
          )}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 dark:border-slate-700">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={userQ}
              onChange={(e) => setUserQ(e.target.value)}
              placeholder="Search users by name, email, role…"
              className="w-full bg-transparent py-2 text-sm outline-none"
            />
          </div>
          {usersLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {!usersLoading && filteredUsers.length === 0 && (
            <p className="text-sm text-slate-500">
              No users visible. Apply migration <code>20260822070000_admin_advanced.sql</code> for staff profile SELECT.
            </p>
          )}
          {filteredUsers.map((u) => (
            <Card key={u.id}>
              <CardContent className="flex flex-wrap items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{u.full_name || 'Unnamed'}</p>
                  <p className="text-xs text-slate-400">{u.email || u.id}</p>
                </div>
                <select
                  value={u.role || 'user'}
                  disabled={u.id === user?.id}
                  onChange={(e) => {
                    const role = e.target.value
                    if (
                      !window.confirm(`Set role of ${u.full_name || u.email || u.id} to "${role}"?`)
                    ) {
                      e.target.value = u.role
                      return
                    }
                    run(() => actions.userRole.mutateAsync({ userId: u.id, role }), `Role → ${role}`)
                  }}
                  className="rounded-lg border border-slate-200 bg-transparent px-2 py-1.5 text-sm dark:border-slate-700"
                >
                  <option value="visitor">visitor</option>
                  <option value="user">user</option>
                  <option value="business">business</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                </select>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
