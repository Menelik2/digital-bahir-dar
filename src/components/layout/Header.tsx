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
    { path: '/explore', label: t.nav.explore },
    { path: '/map', label: t.nav.map },
    { path: '/hotels', label: t.nav.hotels },
    { path: '/restaurants', label: t.nav.restaurants },
    { path: '/attractions', label: t.nav.attractions },
    { path: '/events', label: t.nav.events },
    { path: '/guides', label: t.nav.guides },
    { path: '/trips', label: t.nav.trips },
    { path: '/ai-guide', label: t.nav.aiGuide },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-bold text-sky-600 dark:text-sky-400"
        >
          <MapPin className="h-6 w-6" />
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
                  ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <GlobalSearch className="hidden sm:flex" />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 sm:hidden dark:hover:bg-slate-800"
            onClick={() => setMobileOpen(true)}
            aria-label={t.search.globalPlaceholder}
          >
            <span className="sr-only">Search</span>
            <GlobalSearch />
          </button>
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
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
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
              to="/transport"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              {t.nav.transport}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
