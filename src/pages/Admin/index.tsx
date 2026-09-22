import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
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
  useAdminActions, useAdminCategories, useAdminTransport, useAdminActivity,
} from '@/hooks/useAdmin'
import { downloadCsv, PROFILE_ROLES, slugify } from '@/services/admin'
import { PlaceEditor } from '@/components/admin/PlaceEditor'
import { EventsCmsPanel } from '@/components/admin/EventsCmsPanel'
import { cn } from '@/lib/utils'

type Tab = 'metrics' | 'places' | 'reviews' | 'claims' | 'businesses' | 'reports' | 'users' | 'categories' | 'transport' | 'events'

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
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center">
      <Shield className="mx-auto mb-4 h-12 w-12 text-sky-500" />
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-slate-500">Restoring full dashboard… please hard-refresh in a moment.</p>
      <Link to="/auth" className="mt-6 inline-block"><Button>Log in</Button></Link>
    </div>
  )
}
