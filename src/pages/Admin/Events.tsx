import { Link } from 'react-router-dom'
import { Loader2, Shield, ArrowLeft, LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useIsStaff } from '@/hooks/useAdmin'
import { EventsCmsPanel } from '@/components/admin/EventsCmsPanel'

/** Standalone CMS screen for city events (text + publish) */
export default function AdminEventsPage() {
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
        <h1 className="mb-2 text-2xl font-bold">Events CMS</h1>
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
        <p className="mb-6 text-slate-500">Only admin or moderator can manage events.</p>
        <Link to="/"><Button variant="outline">Back home</Button></Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <LayoutTemplate className="h-7 w-7 text-sky-600" /> Events CMS
          </h1>
          <p className="text-sm text-slate-500">Edit event text and publish without code. Public page: /events</p>
        </div>
        <Link to="/admin">
          <Button size="sm" variant="outline">
            <ArrowLeft className="h-3.5 w-3.5" /> Full admin
          </Button>
        </Link>
      </div>
      <EventsCmsPanel />
    </div>
  )
}
