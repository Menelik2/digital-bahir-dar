import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Loader2, MapPin, MessageSquare, Building2, Flag, LayoutDashboard,
  Check, EyeOff, BadgeCheck, Users, Download, Star, RefreshCw,
  Clock, Tags, Bus, CalendarDays, Activity,
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
import { CategoriesCmsPanel } from '@/components/admin/CategoriesCmsPanel'
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Shield className="mx-auto mb-3 h-10 w-10 text-slate-400" />
        <h1 className="text-xl font-semibold">Sign in required</h1>
        <p className="mt-2 text-sm text-slate-500">Staff accounts can moderate places, reviews, claims, and manage trips & categories.</p>
        <Button className="mt-6" asChild>
          <Link to="/auth">Sign in</Link>
        </Button>
      </div>
    )
  }

  if (!isStaff) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Shield className="mx-auto mb-3 h-10 w-10 text-amber-500" />
        <h1 className="text-xl font-semibold">Staff only</h1>
        <p className="mt-2 text-sm text-slate-500">Your account does not have staff permissions.</p>
        <Button className="mt-6" variant="outline" asChild>
          <Link to="/">Back home</Link>
        </Button>
      </div>
    )
  }

  const nav: { id: Tab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: 'metrics', label: 'Overview', icon: LayoutDashboard },
    { id: 'places', label: 'Places', icon: MapPin, badge: metrics?.placesPending },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'claims', label: 'Claims', icon: BadgeCheck, badge: metrics?.claimsPending },
    { id: 'businesses', label: 'Business', icon: Building2, badge: metrics?.businessesPending },
    { id: 'reports', label: 'Reports', icon: Flag, badge: metrics?.reportsOpen },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'trips', label: 'Trips', icon: Activity },
    { id: 'transport', label: 'Transport', icon: Bus },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {banner && (
        <div className="fixed inset-x-0 top-3 z-50 flex justify-center px-4">
          <div className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg">{banner}</div>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-sky-600" />
            <h1 className="font-semibold">Admin Dashboard</h1>
            {queueTotal > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                {queueTotal} queue
              </span>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={() => { void refetchMetrics(); void refetchPlaces() }} disabled={metricsFetching}>
            <RefreshCw className={`h-3.5 w-3.5 ${metricsFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row">
        <aside className="flex shrink-0 gap-1 overflow-x-auto md:w-44 md:flex-col md:overflow-visible">
          {nav.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm whitespace-nowrap',
                  active ? 'bg-sky-100 font-medium text-sky-900 dark:bg-sky-900/40 dark:text-sky-100' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {!!item.badge && item.badge > 0 && (
                  <span className="rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white">{item.badge}</span>
                )}
              </button>
            )
          })}
        </aside>

        <main className="min-w-0 flex-1 space-y-3">
          {tab === 'metrics' && (
            <div className="space-y-4">
              {metricsLoading ? (
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-sky-500" />
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ['Places', metrics?.placesTotal, `${metrics?.placesPending ?? 0} pending`],
                      ['Reviews', metrics?.reviewsTotal, `${metrics?.reviewsHidden ?? 0} hidden`],
                      ['Claims', metrics?.claimsPending, 'pending'],
                      ['Business', metrics?.businessesPending, 'pending'],
                      ['Reports', metrics?.reportsOpen, 'open'],
                      ['Featured', metrics?.placesFeatured, 'places'],
                      ['Categories', metrics?.categoriesTotal, ''],
                      ['Transport', metrics?.transportTotal, ''],
                    ].map(([label, value, sub]) => (
                      <Card key={String(label)}>
                        <CardContent className="p-3">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
                          <p className="text-2xl font-semibold tabular-nums">{value ?? '—'}</p>
                          <p className="text-xs text-slate-400">{sub}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Card>
                    <CardContent className="p-4">
                      <h2 className="mb-2 flex items-center gap-2 font-medium"><Clock className="h-4 w-4" /> Recent activity</h2>
                      {activityLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                      <ul className="space-y-1.5 text-sm">
                        {(activity ?? []).slice(0, 15).map((a: { id: string; action?: string; entity_type?: string; created_at?: string }) => (
                          <li key={a.id} className="flex justify-between gap-2 border-b border-slate-100 py-1.5 last:border-0 dark:border-slate-800">
                            <span><span className="font-medium">{a.action}</span> <span className="text-slate-500">{a.entity_type}</span></span>
                            <span className="shrink-0 text-xs text-slate-400">{a.created_at ? new Date(a.created_at).toLocaleString() : ''}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {tab === 'places' && (
            <div className="space-y-3">
              <Button size="sm" variant="outline" onClick={() => downloadCsv('places.csv', ['id', 'name', 'status', 'verified', 'featured'], places.map((p) => [p.id, p.name, p.status, String(!!p.verified), String(!!p.featured)]))}>
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
              {placesLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {places.map((p) => (
                <Card key={p.id}>
                  <CardContent className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.status} · {p.address || '—'}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" onClick={async () => { await actions.placeStatus.mutateAsync({ placeId: p.id, status: 'published', verified: true }); flash('Published') }}><Check className="h-3.5 w-3.5" /> Publish</Button>
                      <Button size="sm" variant="outline" onClick={async () => { await actions.placeStatus.mutateAsync({ placeId: p.id, status: 'archived' }); flash('Archived') }}><EyeOff className="h-3.5 w-3.5" /> Archive</Button>
                      <Button size="sm" variant="outline" onClick={async () => { await actions.placeUpdate.mutateAsync({ placeId: p.id, data: { name: p.name, featured: !p.featured } }); flash(p.featured ? 'Unfeatured' : 'Featured') }}><Star className={cn('h-3.5 w-3.5', p.featured && 'fill-amber-400 text-amber-500')} /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-3">
              {reviewsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {reviews.map((r) => (
                <Card key={r.id}>
                  <CardContent className="p-3">
                    <p className="text-sm">{(r as { comment?: string }).comment || (r as { body?: string }).body || '—'}</p>
                    <p className="mt-1 text-xs text-slate-500">Rating {r.rating} · {r.status}</p>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" onClick={async () => { await actions.reviewStatus.mutateAsync({ reviewId: r.id, status: 'hidden' }); flash('Hidden') }}>Hide</Button>
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
                  <CardContent className="flex items-center justify-between gap-2 p-3">
                    <div>
                      <p className="text-sm font-medium">{c.place?.name || c.place_id}</p>
                      <p className="text-xs text-slate-500">{c.message || 'No message'}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" onClick={async () => { await actions.claim.mutateAsync({ claimId: c.id, approve: true }); flash('Approved') }}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={async () => { await actions.claim.mutateAsync({ claimId: c.id, approve: false }); flash('Rejected') }}>Reject</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === 'businesses' && (
            <div className="space-y-3">
              {bizLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {businesses.map((b) => (
                <Card key={b.id}>
                  <CardContent className="flex items-center justify-between p-3">
                    <p className="text-sm font-medium">{b.business_name || 'Business'}</p>
                    <div className="flex gap-1">
                      <Button size="sm" onClick={async () => { await actions.business.mutateAsync({ businessId: b.id, status: 'approved' }); flash('Approved') }}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={async () => { await actions.business.mutateAsync({ businessId: b.id, status: 'suspended' }); flash('Suspended') }}>Suspend</Button>
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
                      <Button size="sm" onClick={async () => { await actions.report.mutateAsync({ reportId: r.id, status: 'resolved' }); flash('Resolved') }}>Resolve</Button>
                      <Button size="sm" variant="outline" onClick={async () => { await actions.report.mutateAsync({ reportId: r.id, status: 'dismissed' }); flash('Dismissed') }}>Dismiss</Button>
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

          {tab === 'categories' && <CategoriesCmsPanel />}
          {tab === 'events' && <EventsCmsPanel />}
          {tab === 'trips' && <TripsCmsPanel />}
          {tab === 'transport' && (
            <p className="text-sm text-slate-500">Transport moderation is available via the transport service APIs; UI expansion coming soon.</p>
          )}
        </main>
      </div>
    </div>
  )
}
