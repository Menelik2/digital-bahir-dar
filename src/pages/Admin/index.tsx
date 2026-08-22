import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Loader2, MapPin, MessageSquare, Building2, Flag, LayoutDashboard,
  Check, X, Eye, EyeOff, BadgeCheck,
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
  useAdminActions,
} from '@/hooks/useAdmin'
import { cn } from '@/lib/utils'

type Tab = 'metrics' | 'places' | 'reviews' | 'claims' | 'businesses' | 'reports'

export default function AdminPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { data: staff, isLoading: roleLoading } = useIsStaff()
  const isStaff = !!staff?.isStaff
  const [tab, setTab] = useState<Tab>('metrics')

  const { data: metrics } = useAdminMetrics(isStaff)
  const { data: places = [], isLoading: placesLoading } = useModerationPlaces(isStaff && tab === 'places')
  const { data: reviews = [], isLoading: reviewsLoading } = useModerationReviews(isStaff && tab === 'reviews')
  const { data: claims = [], isLoading: claimsLoading } = usePendingClaims(isStaff && tab === 'claims')
  const { data: businesses = [], isLoading: bizLoading } = usePendingBusinesses(isStaff && tab === 'businesses')
  const { data: reports = [], isLoading: reportsLoading } = useOpenReports(isStaff && tab === 'reports')
  const actions = useAdminActions()

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

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'metrics', label: 'Metrics', icon: LayoutDashboard },
    { id: 'places', label: 'Places', icon: MapPin },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'claims', label: 'Claims', icon: BadgeCheck },
    { id: 'businesses', label: 'Business', icon: Building2 },
    { id: 'reports', label: 'Reports', icon: Flag },
  ]

  const run = async (fn: () => Promise<unknown>) => {
    try {
      await fn()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Action failed — check RLS and role')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Shield className="h-7 w-7 text-sky-600" /> Admin
        </h1>
        <p className="text-sm text-slate-500">
          Signed in as <span className="font-medium capitalize">{staff?.role}</span>
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition',
              tab === t.id ? 'bg-white shadow dark:bg-slate-800' : 'text-slate-500'
            )}>
            <t.icon className="h-3.5 w-3.5" />{t.label}
          </button>
        ))}
      </div>

      {tab === 'metrics' && metrics && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([
            ['Places total', metrics.placesTotal],
            ['Published', metrics.placesPublished],
            ['Places pending', metrics.placesPending],
            ['Reviews', metrics.reviewsTotal],
            ['Reviews hidden', metrics.reviewsHidden],
            ['Claims pending', metrics.claimsPending],
            ['Businesses pending', metrics.businessesPending],
            ['Open reports', metrics.reportsOpen],
            ['Users (approx)', metrics.usersApprox],
          ] as [string, number][]).map(([label, value]) => (
            <Card key={label}>
              <CardContent className="p-4">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'places' && (
        <div className="space-y-2">
          {placesLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {!placesLoading && places.length === 0 && (
            <p className="text-sm text-slate-500">No places in database (or RLS blocked).</p>
          )}
          {places.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex flex-wrap items-center gap-2 p-3">
                <div className="min-w-0 flex-1">
                  <Link to={`/places/${p.slug}`} className="text-sm font-medium hover:text-sky-600">{p.name}</Link>
                  <p className="text-xs text-slate-400">
                    {p.status}{p.verified ? ' · verified' : ''}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => run(() => actions.placeStatus.mutateAsync({ placeId: p.id, status: 'published', verified: true }))}>
                  <Check className="h-3.5 w-3.5" /> Publish
                </Button>
                <Button size="sm" variant="ghost" onClick={() => run(() => actions.placeStatus.mutateAsync({ placeId: p.id, status: 'hidden' }))}>
                  <EyeOff className="h-3.5 w-3.5" /> Hide
                </Button>
                {!p.verified && (
                  <Button size="sm" variant="ghost" onClick={() => run(() => actions.placeStatus.mutateAsync({ placeId: p.id, status: p.status || 'published', verified: true }))}>
                    <BadgeCheck className="h-3.5 w-3.5" /> Verify
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="space-y-2">
          {reviewsLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
          {!reviewsLoading && reviews.length === 0 && <p className="text-sm text-slate-500">No reviews yet.</p>}
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-3">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{r.profile?.full_name || 'User'}</span>
                  <span className="text-xs text-amber-600">{r.rating}★</span>
                  <span className="rounded bg-slate-100 px-1.5 text-[10px] uppercase dark:bg-slate-800">{r.status}</span>
                </div>
                {r.title && <p className="text-sm font-medium">{r.title}</p>}
                <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>
                <div className="mt-2 flex gap-2">
                  {r.status !== 'published' && (
                    <Button size="sm" variant="outline" onClick={() => run(() => actions.reviewStatus.mutateAsync({ reviewId: r.id, status: 'published' }))}>
                      <Eye className="h-3.5 w-3.5" /> Publish
                    </Button>
                  )}
                  {r.status !== 'hidden' && (
                    <Button size="sm" variant="ghost" onClick={() => run(() => actions.reviewStatus.mutateAsync({ reviewId: r.id, status: 'hidden' }))}>
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
          {!claimsLoading && claims.length === 0 && <p className="text-sm text-slate-500">No pending claims.</p>}
          {claims.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-3">
                <p className="text-sm font-medium">{c.place?.name ?? c.place_id}</p>
                <p className="text-xs text-slate-400">{c.place?.address}</p>
                {c.message && <p className="mt-1 text-sm text-slate-600">{c.message}</p>}
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={() => run(() => actions.claim.mutateAsync({ claimId: c.id, approve: true }))}>
                    <Check className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => run(() => actions.claim.mutateAsync({ claimId: c.id, approve: false }))}>
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
          {!bizLoading && businesses.length === 0 && <p className="text-sm text-slate-500">No pending business profiles.</p>}
          {businesses.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-3">
                <p className="text-sm font-medium">{b.business_name}</p>
                <p className="text-xs text-slate-400">{b.contact_name} · {b.email || b.phone}</p>
                {b.description && <p className="mt-1 text-sm text-slate-600">{b.description}</p>}
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={() => run(() => actions.business.mutateAsync({ businessId: b.id, status: 'approved' }))}>
                    <Check className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => run(() => actions.business.mutateAsync({ businessId: b.id, status: 'suspended' }))}>
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
          {!reportsLoading && reports.length === 0 && <p className="text-sm text-slate-500">No open review reports.</p>}
          {reports.map((r: { id: string; reason: string; details?: string; review?: { comment?: string; rating?: number } }) => (
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
                  <Button size="sm" onClick={() => run(() => actions.report.mutateAsync({ reportId: r.id, status: 'resolved' }))}>Resolve</Button>
                  <Button size="sm" variant="outline" onClick={() => run(() => actions.report.mutateAsync({ reportId: r.id, status: 'dismissed' }))}>Dismiss</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
