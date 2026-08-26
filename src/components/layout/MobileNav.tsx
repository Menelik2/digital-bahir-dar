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
      {/* Floating AI — iOS-style elevated control */}
      <Link
        to="/ai-guide"
        className="bottom-fab-safe fixed right-4 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-br from-[#078930] via-[#0b6e99] to-[#d4a017] text-white shadow-[0_4px_20px_rgba(7,137,48,0.45)] ring-2 ring-white/40 transition active:scale-95 lg:hidden dark:ring-white/20"
        style={{ marginRight: 'env(safe-area-inset-right, 0px)' }}
        aria-label={t.nav.aiGuide}
      >
        <Sparkles className="h-5 w-5" strokeWidth={2.25} />
      </Link>

      {/* iOS tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/[0.08] bg-white/80 pb-safe backdrop-blur-2xl backdrop-saturate-150 dark:border-white/[0.1] dark:bg-black/75 lg:hidden"
        style={{
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        }}
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-between px-1 pt-1.5">
          {items.map(({ path, icon: Icon, label }) => {
            const active =
              path === '/'
                ? location.pathname === '/'
                : location.pathname === path || location.pathname.startsWith(path + '/')
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex min-h-[49px] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1 transition-colors',
                  active ? 'text-[#078930] dark:text-[#30d158]' : 'text-[#8e8e93]'
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full transition-all',
                    active && 'bg-[#078930]/12 dark:bg-[#30d158]/15'
                  )}
                >
                  <Icon
                    className="h-[22px] w-[22px]"
                    strokeWidth={active ? 2.4 : 1.85}
                    fill={active ? 'currentColor' : 'none'}
                    fillOpacity={active ? 0.15 : 0}
                  />
                </span>
                <span
                  className={cn(
                    'max-w-full truncate text-[10px] leading-none',
                    active ? 'font-semibold' : 'font-medium'
                  )}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
