import { Link, useLocation } from 'react-router-dom'
import {
  MapPin,
  Menu,
  X,
  ChevronDown,
  Map,
  Hotel,
  Landmark,
  Sun,
  Sparkles,
  Compass,
  UtensilsCrossed,
  Car,
  ListTodo,
  Calendar,
  Building,
  Bot,
  Wallet,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlobalSearch } from '@/components/search/GlobalSearch'
import { ThemeLangControls } from '@/components/layout/ThemeLangControls'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'

function pathActive(pathname: string, path: string) {
  if (path === '/') return pathname === '/'
  return pathname === path || pathname.startsWith(path + '/')
}

export function Header() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const exploreRef = useRef<HTMLDivElement>(null)
  const t = useT()

  // Primary desktop links — keep short for a clean bar
  const primaryNav = [
    { path: '/', label: t.nav.home },
    { path: '/map', label: t.nav.map, icon: Map },
    { path: '/hotels', label: t.nav.hotels, icon: Hotel },
    { path: '/attractions', label: t.nav.attractions, icon: Landmark },
    { path: '/today', label: t.nav.today, icon: Sun },
    { path: '/trip-planner', label: t.nav.planner, icon: Sparkles },
  ]

  // Extra destinations under Explore
  const exploreNav = [
    { path: '/discover', label: t.nav.discover, icon: Compass },
    { path: '/restaurants', label: t.nav.restaurants, icon: UtensilsCrossed },
    { path: '/transport', label: t.nav.transport, icon: Car },
    { path: '/todo', label: t.nav.todo, icon: ListTodo },
    { path: '/events', label: t.nav.events, icon: Calendar },
    { path: '/city', label: t.nav.city, icon: Building },
    { path: '/ai-guide', label: t.nav.aiGuide, icon: Bot },
    { path: '/budget', label: t.home.budget, icon: Wallet },
    { path: '/trips', label: t.nav.trips, icon: ListTodo },
  ]

  // Full list for mobile drawer
  const mobileNav = [
    ...primaryNav,
    ...exploreNav.filter((e) => !primaryNav.some((p) => p.path === e.path)),
    { path: '/directory', label: t.nav.directory },
  ]

  useEffect(() => {
    setMobileOpen(false)
    setExploreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!exploreRef.current?.contains(e.target as Node)) {
        setExploreOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setExploreOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const exploreActive = exploreNav.some((item) => pathActive(location.pathname, item.path))

  return (
    <header
      className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/80 pt-safe backdrop-blur-2xl backdrop-saturate-150 dark:border-white/[0.08] dark:bg-black/75"
      style={{ WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}
    >
      <div className="ethio-flag-bar" aria-hidden />

      {/* Main bar */}
      <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between gap-3 px-3 sm:h-14 sm:px-6 lg:h-16 xl:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-[#078930] dark:text-[#30d158]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#078930] to-[#0b6e99] text-white shadow-sm sm:h-9 sm:w-9">
            <MapPin className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="hidden text-[15px] font-semibold sm:inline lg:text-[16px]">{t.appName}</span>
          <span className="text-[15px] font-bold sm:hidden">DBD</span>
        </Link>

        {/* Desktop top navigation */}
        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Main"
        >
          {primaryNav.map((item) => {
            const active = pathActive(location.pathname, item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'rounded-full px-3 py-2 text-[13px] font-medium transition-colors xl:px-3.5 xl:text-[14px]',
                  active
                    ? 'bg-[#078930]/12 text-[#056b24] dark:bg-[#30d158]/15 dark:text-[#30d158]'
                    : 'text-[#3c3c43]/85 hover:bg-black/[0.05] dark:text-white/75 dark:hover:bg-white/10'
                )}
              >
                {item.label}
              </Link>
            )
          })}

          {/* Explore dropdown */}
          <div className="relative" ref={exploreRef}>
            <button
              type="button"
              onClick={() => setExploreOpen((v) => !v)}
              aria-expanded={exploreOpen}
              aria-haspopup="menu"
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-medium transition-colors xl:px-3.5 xl:text-[14px]',
                exploreOpen || exploreActive
                  ? 'bg-[#078930]/12 text-[#056b24] dark:bg-[#30d158]/15 dark:text-[#30d158]'
                  : 'text-[#3c3c43]/85 hover:bg-black/[0.05] dark:text-white/75 dark:hover:bg-white/10'
              )}
            >
              {t.nav.explore}
              <ChevronDown
                className={cn('h-3.5 w-3.5 transition', exploreOpen && 'rotate-180')}
              />
            </button>

            {exploreOpen && (
              <div
                role="menu"
                className="absolute left-1/2 top-full z-50 mt-2 w-[min(100vw-2rem,20rem)] -translate-x-1/2 rounded-2xl border border-black/[0.06] bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-white/[0.1] dark:bg-[#1c1c1e]/95"
              >
                <div className="grid grid-cols-1 gap-0.5">
                  {exploreNav.map((item) => {
                    const active = pathActive(location.pathname, item.path)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        role="menuitem"
                        onClick={() => setExploreOpen(false)}
                        className={cn(
                          'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors',
                          active
                            ? 'bg-[#078930]/10 text-[#056b24] dark:bg-[#30d158]/15 dark:text-[#30d158]'
                            : 'text-[#1c1c1e] hover:bg-black/[0.04] dark:text-white/90 dark:hover:bg-white/10'
                        )}
                      >
                        {Icon && (
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f2f2f7] text-[#078930] dark:bg-white/10 dark:text-[#30d158]">
                            <Icon className="h-4 w-4" strokeWidth={2} />
                          </span>
                        )}
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1.5">
          <GlobalSearch className="hidden md:flex" />
          <div className="md:hidden">
            <GlobalSearch className="flex h-11 w-11 items-center justify-center rounded-full border-0 bg-transparent px-0 py-0" />
          </div>
          <ThemeLangControls />
          <Link to="/auth" className="hidden sm:inline-flex">
            <Button size="sm" className="rounded-full px-4">
              {t.nav.login}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Optional secondary strip on very wide screens — quick actions */}
      <div className="hidden border-t border-black/[0.04] bg-[#f8f8fa]/90 dark:border-white/[0.06] dark:bg-black/40 xl:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-6 py-1.5 xl:px-8">
          <span className="mr-2 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[#8e8e93]">
            Quick
          </span>
          {[
            { path: '/restaurants', label: t.nav.restaurants },
            { path: '/transport', label: t.nav.transport },
            { path: '/discover', label: t.nav.discover },
            { path: '/events', label: t.nav.events },
            { path: '/ai-guide', label: t.nav.aiGuide },
            { path: '/budget', label: t.home.budget },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors',
                pathActive(location.pathname, item.path)
                  ? 'bg-[#078930]/12 text-[#056b24] dark:bg-[#30d158]/15 dark:text-[#30d158]'
                  : 'text-[#3c3c43]/75 hover:bg-black/[0.04] dark:text-white/65 dark:hover:bg-white/10'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      {mobileOpen && (
        <div className="max-h-[75vh] overflow-y-auto border-t border-black/[0.06] bg-white/95 px-3 py-2 backdrop-blur-xl lg:hidden dark:border-white/[0.08] dark:bg-[#1c1c1e]/95">
          <nav className="flex flex-col gap-0.5 pb-2" aria-label="Mobile">
            {mobileNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-xl px-3.5 py-3 text-[15px] font-medium active:bg-black/5 dark:active:bg-white/10',
                  pathActive(location.pathname, item.path)
                    ? 'bg-[#078930]/10 text-[#056b24] dark:bg-[#30d158]/15 dark:text-[#30d158]'
                    : 'text-[#1c1c1e] dark:text-white/90'
                )}
              >
                {item.label}
              </Link>
            ))}
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
