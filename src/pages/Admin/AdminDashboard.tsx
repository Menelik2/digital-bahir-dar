import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Loader2, MapPin, MessageSquare, Building2, Flag, LayoutDashboard,
  Check, EyeOff, BadgeCheck, Users, Search, Download, Star, RefreshCw,
  Pencil, Trash2, Plus, Clock, Tags, Bus, CalendarDays, Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import {
  useIsStaff, useAdminMetrics, useModerationPlaces, useModerationReviews,
  usePendingClaims, usePendingBusinesses, useOpenReports, useAdminUsers,
  useAdminActions, useAdminActivity,
} from '@/hooks/useAdmin'
import { downloadCsv } from '@/services/admin'
import { EventsCmsPanel } from '@/components/admin/EventsCmsPanel'
import { TripsCmsPanel } from '@/components/admin/TripsCmsPanel'
import { cn } from '@/lib/utils'

type Tab = 'metrics' | 'places' | 'reviews' | 'claims' | 'businesses' | 'reports' | 'users' | 'categories' | 'transport' | 'events' | 'trips'

export default function AdminDashboard() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { data: staff, isLoading: roleLoading } = useIsStaff()
  const isStaff = !!staff?.isStaff
  const [tab, setTab] = useState<Tab>('metrics')
  const [banner, setBanner] = useState<string | null>(null)

  const { data: metrics, refetch: refetchMetrics, isFetching: metricsFetching, isLoading: metricsLoading } = useAdminMetrics(isStaff)
  const { data: places = [], isLoading: placesLoading, refetch: refetchPlaces } = useModerationPlaces(isStaff && tab === 'places')
  const { data: reviews = [], isLoading: reviewsLoading } = useModerationReviews(isStaff && tab === 'reviews')
  const { data: claims = [], isLoading: claimsLoading } = usePendingClaims(isStaff && tab === 'claims')
  const { data: businesses = [], isLoading: bizLoading } = usePendingBusinesses(isStaff && tab === 'businesses')
  const { data: reports = [], isLoading: reportsLoading } = useOpenReports(isStaff && tab === 'reports')
  const { data: users = [], isLoading: usersLoading } = useAdminUsers(isStaff && tab === 'users')
  const { data: activity = [], isLoading: activityLoading } = useAdminActivity(isStaff && tab === 'metrics')
  const actions = useAdminActions()

  const queueTotal =
    (metrics?.placesPending ?? 0) +
    (metrics?.claimsPending ?? 0) +
    (metrics?.businessesPending ?? 0) +
    (metrics?.reportsOpen ?? 0)

  const flash = (msg: string) => {
    setBanner(msg)
    window.setTimeout(() => setBanner(null), 3500)
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
        <p className="mb-4 text-slate-500">Your role is <strong>{staff?.role ?? 'visitor'}</strong>.</p>
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
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'trips', label: 'Trips', icon: CalendarDays },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'transport', label: 'Transport', icon: Bus },
  ]

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 pb-nav-safe sm:px-4 lg:px-8">
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
          {tab === 'metrics' && (
            <div className="space-y-6">
              {metricsLoading && !metrics && (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>
              )}
              {metrics && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {([
                      ['Places total', metrics.placesTotal, 'places', MapPin],
                      ['Published', metrics.placesPublished, 'places', Check],
                      ['Pending places', metrics.placesPending, 'places', Clock],
                      ['Featured', metrics.placesFeatured ?? 0, 'places', Star],
                      ['Reviews', metrics.reviewsTotal, 'reviews', MessageSquare],
                      ['Hidden reviews', metrics.reviewsHidden, 'reviews', EyeOff],
                      ['Claims pending', metrics.claimsPending, 'claims', BadgeCheck],
                      ['Businesses pending', metrics.businessesPending, 'businesses', Building2],
                      ['Open reports', metrics.reportsOpen, 'reports', Flag],
                      ['Users', metrics.usersApprox, 'users', Users],
                    ] as [string, number, Tab, typeof MapPin][]).map(([label, value, jump, Icon]) => (
                      <button key={label} type="button" onClick={() => setTab(jump)} className="text-left">
                        <Card className="transition hover:border-sky-300 hover:shadow-sm">
                          <CardContent className="flex items-center gap-3 p-4">
                            <div className="rounded-lg bg-sky-50 p-2 dark:bg-sky-950"><Icon className="h-4 w-4 text-sky-600" /></div>
                            <div>
                              <p className="text-xs text-slate-400">{label}</p>
                              <p className="text-2xl font-bold tabular-nums">{value}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </button>
                    ))}
                  </div>
                  <Card className="border-amber-200/80 dark:border-amber-900/40">
                    <CardContent className="p-4">
                      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-200">
                        <Clock className="h-4 w-4" /> Priority queue
                      </h2>
                      <p className="mb-3 text-xs text-slate-500">Jump to items that need staff action.</p>
                      <div className="flex flex-wrap gap-2">
                        {([
                          ['Pending places', metrics.placesPending ?? 0, 'places' as Tab],
                          ['Open reports', metrics.reportsOpen ?? 0, 'reports' as Tab],
                          ['Claims', metrics.claimsPending ?? 0, 'claims' as Tab],
                          ['Businesses', metrics.businessesPending ?? 0, 'businesses' as Tab],
                        ] as [string, number, Tab][]).map(([label, n, jump]) => (
                          <button key={label} type="button" onClick={() => setTab(jump)} className={cn(
                            'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                            n > 0
                              ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100'
                              : 'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900'
                          )}>
                            {label}<span className="tabular-nums">{n}</span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        <Activity className="h-4 w-4 text-sky-600" /> Recent activity
                      </h2>
                      {activityLoading && <Loader2 className="h-5 w-5 animate-spin text-sky-500" />}
                      {!activityLoading && activity.length === 0 && <p className="text-sm text-slate-400">No recent activity.</p>}
                      <ul className="space-y-2">
                        {activity.slice(0, 12).map((a: { id?: string; summary?: string; detail?: string; created_at?: string; at?: string; action?: string }, idx: number) => (
                          <li key={a.id ?? `${a.at ?? a.created_at}-${idx}`} className="flex justify-between gap-2 border-b border-slate-100 py-1.5 text-sm last:border-0 dark:border-slate-800">
                            <span className="min-w-0">
                              <span className="font-medium">{a.action ?? a.summary ?? 'Update'}</span>
                              {a.detail && <span className="mt-0.5 block truncate text-xs text-slate-500">{a.detail}</span>}
                            </span>
                            <span className="shrink-0 text-xs text-slate-400">{a.at ?? a.created_at ?? ''}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {tab === 'events' && <EventsCmsPanel />}

          {tab === 'trips' && <TripsCmsPanel />}

          {tab === 'places' && (
            <div className="space-y-3">
              {placesLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {!placesLoading && places.length === 0 && <p className="text-sm text-slate-400">No places loaded.</p>}
              {places.slice(0, 50).map((p) => (
                <Card key={p.id}>
                  <CardContent className="p-3">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-medium">{p.name}{p.featured ? ' ★' : ''}{p.verified ? ' ✓' : ''}</p>
                        <p className="text-xs text-slate-400">{p.slug} · {p.status}</p>
                      </div>
                      <div className="flex gap-1">
                        {p.status !== 'published' && (
                          <Button size="sm" onClick={async () => { try { await actions.placeStatus.mutateAsync({ placeId: p.id, status: 'published' }); flash('Published') } catch (e) { alert(String(e)) } }}>Publish</Button>
                        )}
                        <Button size="sm" variant="outline" onClick={async () => { try { await actions.placeFeatured.mutateAsync({ placeId: p.id, featured: !p.featured }); flash(p.featured ? 'Unfeatured' : 'Featured') } catch (e) { alert(String(e)) } }}>
                          <Star className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-3">
              {reviewsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {reviews.slice(0, 40).map((r) => (
                <Card key={r.id}>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">{r.title || 'Review'}</p>
                    <p className="text-xs text-slate-500">{r.comment}</p>
                    <div className="mt-2 flex gap-2">
                      {r.status !== 'published' && <Button size="sm" onClick={async () => { await actions.reviewStatus.mutateAsync({ reviewId: r.id, status: 'published' }); flash('Published') }}>Publish</Button>}
                      {r.status !== 'hidden' && <Button size="sm" variant="outline" onClick={async () => { await actions.reviewStatus.mutateAsync({ reviewId: r.id, status: 'hidden' }); flash('Hidden') }}>Hide</Button>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === 'claims' && (
            <div className="space-y-3">
              {claimsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {claims.map((c) => (
                <Card key={c.id}>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">{c.place?.name ?? 'Claim'}</p>
                    <p className="text-xs text-slate-500">{c.message}</p>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={async () => { await actions.resolveClaim.mutateAsync({ claimId: c.id, approve: true }); flash('Approved') }}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={async () => { await actions.resolveClaim.mutateAsync({ claimId: c.id, approve: false }); flash('Rejected') }}>Reject</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!claimsLoading && claims.length === 0 && <p className="text-sm text-slate-400">No pending claims.</p>}
            </div>
          )}

          {tab === 'businesses' && (
            <div className="space-y-3">
              {bizLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {businesses.map((b) => (
                <Card key={b.id}>
                  <CardContent className="flex items-center justify-between p-3">
                    <p className="text-sm font-medium">{b.name ?? (b as { business_name?: string }).business_name ?? 'Business'}</p>
                    <div className="flex gap-1">
                      <Button size="sm" onClick={async () => { await actions.businessStatus.mutateAsync({ businessId: b.id, status: 'approved' }); flash('Approved') }}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={async () => { await actions.businessStatus.mutateAsync({ businessId: b.id, status: 'suspended' }); flash('Suspended') }}>Suspend</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                      <Button size="sm" onClick={async () => { await actions.resolveReport.mutateAsync({ reportId: r.id, status: 'resolved' }); flash('Resolved') }}>Resolve</Button>
                      <Button size="sm" variant="outline" onClick={async () => { await actions.resolveReport.mutateAsync({ reportId: r.id, status: 'dismissed' }); flash('Dismissed') }}>Dismiss</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === 'users' && (
            <div className="space-y-3">
              {usersLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {users.slice(0, 50).map((u) => (
                <Card key={u.id}>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">{u.full_name || u.email}</p>
                    <p className="text-xs text-slate-400">{u.email} · {u.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === 'categories' && <p className="text-sm text-slate-500">Categories managed via Places editor.</p>}
          {tab === 'transport' && <p className="text-sm text-slate-500">Transport list loads when expanded in a future update.</p>}
        </main>
      </div>
    </div>
  )
}
