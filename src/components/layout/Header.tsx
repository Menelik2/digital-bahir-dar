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
    <header className="sticky top-0 z-50 border-b border-[#078930]/15 bg-[#faf8f5]/90 backdrop-blur-md dark:border-[#078930]/25 dark:bg-slate-950/90">
      <div className="ethio-flag-bar" aria-hidden />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-bold text-[#078930] dark:text-[#7dcea0]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#078930] to-[#0b6e99] text-white shadow-sm">
            <MapPin className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">{t.appName}</span>
          <span className="sm:hidden">DBD</span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                location.pathname === item.path
                  ? 'bg-[#078930]/12 text-[#056b24] dark:bg-[#078930]/25 dark:text-[#7dcea0]'
                  : 'text-slate-600 hover:bg-[#078930]/8 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <GlobalSearch className="hidden sm:flex" />
          <div className="sm:hidden">
            <GlobalSearch className="flex h-10 w-10 items-center justify-center rounded-lg border-0 bg-transparent px-0 py-0" />
          </div>
          <ThemeLangControls />
          <Link to="/auth">
            <Button size="sm" className="hidden sm:inline-flex">
              {t.nav.login}
            </Button>
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
        <div className="border-t border-slate-200 bg-white px-4 py-3 xl:hidden dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium',
                  location.pathname === item.path
                    ? 'bg-[#078930]/12 text-[#056b24] dark:bg-[#078930]/25 dark:text-[#7dcea0]'
                    : 'text-slate-600 dark:text-slate-300'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/directory"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              {t.nav.directory}
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              {t.nav.events}
            </Link>
            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#078930] dark:text-[#7dcea0]"
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
