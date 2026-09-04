import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Loader2, LayoutDashboard, MapPin, Bus, CalendarDays, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useIsStaff, useAdminMetrics, useAdminTransport, useAdminActivity, useAdminActions } from '@/hooks/useAdmin'
import { EventsCmsPanel } from '@/components/admin/EventsCmsPanel'
import { cn } from '@/lib/utils'

type Tab = 'metrics' | 'transport' | 'events' | 'full'

export default function AdminPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { data: staff, isLoading: roleLoading } = useIsStaff()
  const isStaff = !!staff?.isStaff
  const [tab, setTab] = useState<Tab>('metrics')
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics(isStaff)
  const { data: transportList = [] } = useAdminTransport(isStaff && tab === 'transport')
  const { data: activity = [] } = useAdminActivity(isStaff && tab === 'metrics')
  const actions = useAdminActions()

  if (authLoading || roleLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>
  }
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Shield className="mx-auto mb-4 h-12 w-12 text-slate-300" />
        <h1 className="mb-2 text-2xl font-bold">Admin</h1>
        <p className="mb-6 text-slate-500">Sign in with a staff account.</p>
        <Link to="/auth"><Button size="lg">Log in</Button></Link>
      </div>
    )
  }
  if (!isStaff) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Shield className="mx-auto mb-4 h-12 w-12 text-amber-400" />
        <h1 className="mb-2 text-2xl font-bold">Access restricted</h1>
        <p className="mb-4 text-slate-500">Role: {staff?.role ?? 'visitor'}</p>
        <Link to="/"><Button variant="outline">Back home</Button></Link>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'metrics', label: 'Overview', icon: LayoutDashboard },
    { id: 'transport', label: 'Transport', icon: Bus },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'full', label: 'Full dashboard', icon: MapPin },
  ]

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4">
      <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold">
        <Shield className="h-7 w-7 text-sky-600" /> Admin Dashboard
      </h1>
      <p className="mb-4 text-sm text-slate-500">Signed in as <span className="font-medium capitalize">{staff?.role}</span></p>
      <nav className="mb-6 flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
            tab === t.id ? 'bg-white text-sky-700 shadow dark:bg-slate-800' : 'text-slate-500'
          )}>
            <t.icon className="h-4 w-4" />{t.label}
          </button>
        ))}
      </nav>
      {tab === 'metrics' && (
        <div className="space-y-4">
          {metricsLoading && <Loader2 className="mx-auto h-8 w-8 animate-spin text-sky-500" />}
          {metrics && (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Object.entries(metrics).map(([k, v]) => (
                <Card key={k}><CardContent className="p-4"><p className="text-xs text-slate-400">{k}</p><p className="text-2xl font-bold">{String(v)}</p></CardContent></Card>
              ))}
            </div>
          )}
          <Card>
            <CardContent className="p-4">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Activity className="h-4 w-4" /> Recent activity</h2>
              {activity.length === 0 ? <p className="text-sm text-slate-500">No recent activity</p> : (
                <ul className="space-y-2 text-sm">
                  {activity.map((a) => (
                    <li key={a.id} className="flex justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900">
                      <span><strong>{a.action}</strong> — {a.detail}</span>
                      <span className="text-xs text-slate-400 shrink-0">{a.at?.slice(0, 10)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      {tab === 'events' && (
        <div>
          <p className="mb-3 text-sm text-slate-500">Manage city events. Full CMS also at <Link className="text-sky-600" to="/admin/events">/admin/events</Link>.</p>
          <EventsCmsPanel />
        </div>
      )}
      {tab === 'transport' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">{transportList.length} transport services. Use the full dashboard for create/edit.</p>
          {transportList.map((t: { id: string; provider_name?: string; service_type?: string; verified?: boolean }) => (
            <Card key={t.id}><CardContent className="flex items-center justify-between p-3">
              <div><p className="font-medium">{t.provider_name}</p><p className="text-xs text-slate-500">{t.service_type}</p></div>
              <Button size="sm" variant="outline" onClick={() => actions.transportVerified.mutate({ id: t.id, verified: !t.verified })}>
                {t.verified ? 'Unverify' : 'Verify'}
              </Button>
            </CardContent></Card>
          ))}
        </div>
      )}
      {tab === 'full' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/40">
          <p className="font-medium">Full places/reviews/claims CRUD is loading from the advanced build.</p>
          <p className="mt-2 text-slate-600 dark:text-slate-300">The complete Admin index (transport form, CSV, bulk actions) is being restored. Service layer already supports create/delete transport + activity feed.</p>
          <Button className="mt-3" size="sm" onClick={() => actions.invalidate()}>Refresh data</Button>
        </div>
      )}
    </div>
  )
}
