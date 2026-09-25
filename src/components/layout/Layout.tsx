import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'
import { OfflineBanner } from '@/components/pwa/OfflineBanner'
import { useRegisterSW } from '@/hooks/useRegisterSW'
import { useThemeSync } from '@/hooks/useTheme'
import { useDocumentLang, useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'

/** Routes where the site footer is hidden (places, map, browse, tools). */
function hideFooter(pathname: string): boolean {
  if (pathname === '/map' || pathname.startsWith('/map/')) return true
  if (pathname === '/explore-3d' || pathname.startsWith('/explore-3d/')) return true
  if (pathname.startsWith('/places/')) return true
  const noFooter = [
    '/hotels',
    '/restaurants',
    '/attractions',
    '/banks',
    '/transport',
    '/explore',
    '/discover',
    '/events',
    '/directory',
    '/todo',
    '/today',
    '/city',
    '/trips',
    '/trip-planner',
    '/budget',
    '/spend-guide',
    '/expenses',
    '/ai-guide',
    '/guides',
    '/help',
    '/visitor',
    '/business',
    '/admin',
    '/auth',
  ]
  return noFooter.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export function Layout() {
  useRegisterSW()
  useThemeSync()
  useDocumentLang()
  const t = useT()
  const { pathname } = useLocation()
  const isMap = pathname === '/map' || pathname.startsWith('/map/')
  const isAiGuide = pathname === '/ai-guide' || pathname.startsWith('/ai-guide/')
  const isExplore3D = pathname === '/explore-3d' || pathname.startsWith('/explore-3d/')
  const isImmersive = isMap || isAiGuide || isExplore3D
  const noFooter = hideFooter(pathname)

  return (
    <div
      className={cn(
        'flex min-h-full flex-col bg-[#f2f2f7] dark:bg-black',
        isImmersive && 'h-dvh max-h-dvh overflow-hidden'
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        {t.common.skipToContent}
      </a>
      {!isExplore3D && <Header />}
      <OfflineBanner />
      <main
        id="main-content"
        className={cn(
          'page-enter flex-1',
          isImmersive ? 'min-h-0 overflow-hidden pb-0' : 'pb-nav-safe lg:pb-8'
        )}
        tabIndex={-1}
      >
        <Outlet />
      </main>
      {!noFooter && (
        <footer className="hidden border-t border-black/[0.04] bg-white/80 dark:border-white/[0.08] dark:bg-[#0c0c0e]/90 lg:block">
          <div className="mx-auto max-w-7xl px-4 py-4 text-center sm:px-6 lg:px-8">
            <p className="text-[12px] font-medium tracking-wide text-[#8e8e93]">
              {t.common.developedBy}{' '}
              <span className="font-semibold text-[#1c1c1e] dark:text-white">Menelik Admasu</span>
              <span className="text-[#aeaeb2]"> · © {new Date().getFullYear()} Digital Bahir Dar</span>
            </p>
          </div>
        </footer>
      )}
      {!isExplore3D && <MobileNav />}
      <InstallPrompt />
    </div>
  )
}
