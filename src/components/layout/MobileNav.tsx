import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, Map, Calendar, User, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/useT'

export function MobileNav() {
  const location = useLocation()
  const t = useT()

  const items = [
    { path: '/', icon: Home, label: t.nav.home },
    { path: '/explore', icon: Compass, label: t.nav.explore },
    { path: '/map', icon: Map, label: t.nav.map },
    { path: '/trips', icon: Calendar, label: t.nav.trips },
    { path: '/profile', icon: User, label: t.nav.profile },
  ]

  return (
    <>
      <Link
        to="/ai-guide"
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#078930] via-[#0b6e99] to-[#d4a017] text-white shadow-lg ring-2 ring-[#f5c518]/40 lg:hidden"
        aria-label={t.nav.aiGuide}
      >
        <Sparkles className="h-6 w-6" />
      </Link>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#078930]/15 bg-[#faf8f5]/95 backdrop-blur dark:border-[#078930]/25 dark:bg-slate-950/95 lg:hidden">
        <div className="flex items-center justify-around px-2 py-1">
          {items.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-xs font-medium',
                  active ? 'text-[#078930] dark:text-[#7dcea0]' : 'text-slate-500 dark:text-slate-400'
                )}
              >
                <Icon className={cn('h-5 w-5', active && 'text-[#078930] dark:text-[#7dcea0]')} />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
