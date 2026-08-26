import { Link, useLocation } from 'react-router-dom'
import { MapPin, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlobalSearch } from '@/components/search/GlobalSearch'
import { ThemeLangControls } from '@/components/layout/ThemeLangControls'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'

export function Header() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useT()

  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/today', label: t.nav.today },
    { path: '/todo', label: t.nav.todo },
    { path: '/city', label: t.nav.city },
    { path: '/discover', label: t.nav.discover },
    { path: '/map', label: t.nav.map },
    { path: '/hotels', label: t.nav.hotels },
    { path: '/restaurants', label: t.nav.restaurants },
    { path: '/transport', label: t.nav.transport },
    { path: '/trips', label: t.nav.trips },
    { path: '/trip-planner', label: t.nav.planner },
    { path: '/ai-guide', label: t.nav.aiGuide },
  ]

  return (
    <header
      className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/75 pt-safe backdrop-blur-2xl backdrop-saturate-150 dark:border-white/[0.08] dark:bg-black/70"
      style={{ WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}
    >
      <div className="ethio-flag-bar" aria-hidden />
      <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between gap-2 px-3 sm:h-14 sm:gap-3 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-[#078930] dark:text-[#30d158]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#078930] to-[#0b6e99] text-white shadow-sm">
            <MapPin className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="hidden text-[15px] sm:inline">{t.appName}</span>
          <span className="text-[15px] font-bold sm:hidden">DBD</span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
                location.pathname === item.path
                  ? 'bg-[#078930]/12 text-[#056b24] dark:bg-[#30d158]/15 dark:text-[#30d158]'
                  : 'text-[#3c3c43]/80 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1.5">
          <GlobalSearch className="hidden sm:flex" />
          <div className="sm:hidden">
            <GlobalSearch className="flex h-11 w-11 items-center justify-center rounded-full border-0 bg-transparent px-0 py-0" />
          </div>
          <ThemeLangControls />
          <Link to="/auth" className="hidden sm:inline-flex">
            <Button size="sm">{t.nav.login}</Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[70vh] overflow-y-auto border-t border-black/[0.06] bg-white/95 px-3 py-2 backdrop-blur-xl xl:hidden dark:border-white/[0.08] dark:bg-[#1c1c1e]/95">
          <nav className="flex flex-col gap-0.5 pb-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-xl px-3.5 py-3 text-[15px] font-medium active:bg-black/5 dark:active:bg-white/10',
                  location.pathname === item.path
                    ? 'bg-[#078930]/10 text-[#056b24] dark:bg-[#30d158]/15 dark:text-[#30d158]'
                    : 'text-[#1c1c1e] dark:text-white/90'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/directory"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3.5 py-3 text-[15px] font-medium text-[#1c1c1e] dark:text-white/90"
            >
              {t.nav.directory}
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3.5 py-3 text-[15px] font-medium text-[#1c1c1e] dark:text-white/90"
            >
              {t.nav.events}
            </Link>
            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              className="mt-1 rounded-xl bg-[#078930] px-3.5 py-3 text-center text-[15px] font-semibold text-white"
            >
              {t.nav.login}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
