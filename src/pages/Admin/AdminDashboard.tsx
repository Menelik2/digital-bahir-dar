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
        <p className="mt-2 text-sm text-slate-500">Sign in with a staff account to manage the city platform.</p>
        <Button asChild className="mt-6">
          <Link to="/auth">Sign in</Link>
        </Button>
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
    { id: 'transport', label: 'Transport', icon: Bus },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'trips', label: 'Trips', icon: Activity },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {banner && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {banner}
        </div>
      )}

      <header className="border-b bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-sky-600" />
            <div>
              <h1 className="text-lg font-semibold leading-tight">Admin</h1>
              <p className="text-xs text-slate-500">Digital Bahir Dar</p>
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
                refetchMetrics()
                refetchPlaces()
              }}
              disabled={metricsFetching}
            >
              <RefreshCw className={cn('h-3.5 w-3.5', metricsFetching && 'animate-spin')} />
            </Button>
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
                  <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {t.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <main className="min-w-0 flex-1 space-y-4">
          {tab === 'metrics' && (
            <div className="space-y-4">
              {metricsLoading ? (
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-sky-500" />
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: 'Places', value: metrics?.placesTotal, sub: `${metrics?.placesPending ?? 0} pending` },
                      { label: 'Reviews', value: metrics?.reviewsTotal, sub: `${metrics?.reviewsHidden ?? 0} hidden` },
                      { label: 'Claims', value: metrics?.claimsPending, sub: 'awaiting review' },
                      { label: 'Businesses', value: metrics?.businessesPending, sub: 'pending' },
                      { label: 'Reports', value: metrics?.reportsOpen, sub: 'open' },
                      { label: 'Featured', value: metrics?.placesFeatured, sub: 'places' },
                      { label: 'Categories', value: metrics?.categoriesTotal, sub: 'active' },
                      { label: 'Transport', value: metrics?.transportTotal, sub: 'services' },
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
                        {(activity ?? []).slice(0, 12).map((a: { id: string; action?: string; entity_type?: string; created_at?: string }) => (
                          <li key={a.id} className="flex justify-between gap-2 border-b border-slate-100 pb-2 last:border-0 dark:border-slate-800">
                            <span>
                              <span className="font-medium">{a.action}</span>{' '}
                              <span className="text-slate-500">{a.entity_type}</span>
                            </span>
                            <span className="shrink-0 text-xs text-slate-400">
                              {a.created_at ? new Date(a.created_at).toLocaleString() : ''}
                            </span>
                          </li>
                        ))}
                        {!activityLoading && (!activity || activity.length === 0) && (
                          <li className="text-slate-500">No recent staff actions logged.</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {tab === 'places' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const rows = places.map((p) => [p.id, p.name, p.status, p.verified ? 'yes' : 'no', p.featured ? 'yes' : 'no'])
                    downloadCsv('places-moderation.csv', ['id', 'name', 'status', 'verified', 'featured'], rows)
                  }}
                >
                  <Download className="h-3.5 w-3.5" /> CSV
                </Button>
              </div>
              {placesLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
              {places.map((p) => (
                <Card key={p.id}>
                  <CardContent className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.status} · {p.address || 'No address'}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" onClick={async () => { await actions.placeStatus.mutateAsync({ placeId: p.id, status: 'published', verified: true }); flash('Published') }}>
                        <Check className="h-3.5 w-3.5" /> Publish
                      </Button>
                      <Button size="sm" variant="outline" onClick={async () => { await actions.placeStatus.mutateAsync({ placeId: p.id, status: 'archived' }); flash('Archived') }}>
                        <EyeOff className="h-3.5 w-3.5" /> Archive
                      </Button>
                      <Button size="sm" variant="outline" onClick={async () => { await actions.placeUpdate.mutateAsync({ placeId: p.id, data: { featured: !p.featured } }); flash(p.featured ? 'Unfeatured' : 'Featured') }}>
                        <Star className={cn('h-3.5 w-3.5', p.featured && 'fill-amber-400 text-amber-500')} />
                      </Button>
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
                    <p className="text-sm">{r.body || r.comment || '—'}</p>
                    <p className="mt-1 text-xs text-slate-500">Rating {r.rating} · {r.status}</p>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline" onClick={async () => { await actions.reviewHide.mutateAsync(r.id); flash('Hidden') }}>
                        Hide
                      </Button>
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
                  <CardContent className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">{c.place?.name || c.place_id}</p>
                      <p className="text-xs text-slate-500">{c.message || 'No message'}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" onClick={async () => { await actions.claim.mutateAsync({ claimId: c.id, status: 'approved' }); flash('Approved') }}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={async () => { await actions.claim.mutateAsync({ claimId: c.id, status: 'rejected' }); flash('Rejected') }}>Reject</Button>
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
          {tab === 'transport' && <p className="text-sm text-slate-500">Transport list loads when expanded in a future update.</p>}
        </main>
      </div>
    </div>
  )
}
