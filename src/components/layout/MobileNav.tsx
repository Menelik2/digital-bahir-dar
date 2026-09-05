import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, Map, Calendar, User, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/useT'

/**
 * Mobile-only bottom chrome — iOS tab bar + floating AI control.
 * Hidden from lg+ (desktop keeps header nav).
 */
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
      {/* Floating AI — elevated control above tab bar */}
      <Link
        to="/ai-guide"
        className="bottom-fab-safe fixed right-3 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#078930] via-[#0b6e99] to-[#d4a017] text-white shadow-[0_6px_24px_rgba(7,137,48,0.4)] ring-[3px] ring-white/50 transition-transform active:scale-90 lg:hidden dark:ring-white/15"
        style={{ marginRight: 'max(0px, env(safe-area-inset-right, 0px))' }}
        aria-label={t.nav.aiGuide}
      >
        <Sparkles className="h-[22px] w-[22px]" strokeWidth={2.25} />
      </Link>

      {/* iOS-style tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        aria-label="Mobile"
      >
        <div
          className="border-t border-black/[0.08] bg-white/85 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/[0.12] dark:bg-[#1c1c1e]/88"
          style={{
            WebkitBackdropFilter: 'saturate(180%) blur(24px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <div className="mx-auto flex max-w-lg items-stretch justify-between px-0.5 pt-1">
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
                    'relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1 transition-colors',
                    active ? 'text-[#078930] dark:text-[#30d158]' : 'text-[#8e8e93]'
                  )}
                >
                  {/* Active pill behind icon */}
                  <span
                    className={cn(
                      'flex h-8 w-12 items-center justify-center rounded-full transition-all duration-200',
                      active && 'bg-[#078930]/12 dark:bg-[#30d158]/18'
                    )}
                  >
                    <Icon
                      className="h-[23px] w-[23px]"
                      strokeWidth={active ? 2.5 : 1.9}
                      fill={active ? 'currentColor' : 'none'}
                      fillOpacity={active ? 0.18 : 0}
                    />
                  </span>
                  <span
                    className={cn(
                      'max-w-full truncate px-0.5 text-center text-[10px] leading-none tracking-tight',
                      active ? 'font-semibold' : 'font-medium'
                    )}
                  >
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
          {/* Home indicator hint (visual only; real home bar is system) */}
          <div className="flex justify-center pb-1 pt-0.5 sm:hidden" aria-hidden>
            <div className="h-1 w-28 rounded-full bg-black/15 dark:bg-white/25" />
          </div>
        </div>
      </nav>
    </>
  )
}
