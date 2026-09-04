import { Link } from 'react-router-dom'
import { Shield, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useIsStaff } from '@/hooks/useAdmin'

export default function AdminPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { data: staff, isLoading: roleLoading } = useIsStaff()
  const isStaff = !!staff?.isStaff

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
        <p className="mb-6 text-slate-500">
          Your role is <strong>{staff?.role ?? 'visitor'}</strong>. Only admin or moderator can open this dashboard.
        </p>
        <Link to="/"><Button variant="outline">Back home</Button></Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold">
        <Shield className="h-7 w-7 text-sky-600" /> Admin Dashboard
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        Signed in as <span className="font-medium capitalize">{staff?.role}</span>
      </p>
      <p className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100">
        Admin shell is online. Full CRUD tabs (Places, Reviews, Transport, Events) will load after the advanced panel is reattached. AI Guide build errors are fixed.
      </p>
    </div>
  )
}
