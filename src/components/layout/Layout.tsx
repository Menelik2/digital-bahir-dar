import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'
import { OfflineBanner } from '@/components/pwa/OfflineBanner'
import { useRegisterSW } from '@/hooks/useRegisterSW'
import { useThemeSync } from '@/hooks/useTheme'
import { useDocumentLang, useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'

export function Layout() {
  useRegisterSW()
  useThemeSync()
  useDocumentLang()
  const t = useT()
  const { pathname } = useLocation()
  const isMap = pathname === '/map' || pathname.startsWith('/map/')

  return (
    <div
      className={cn(
        'flex min-h-full flex-col bg-[#f2f2f7] dark:bg-black',
        isMap && 'h-dvh max-h-dvh overflow-hidden'
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        {t.common.skipToContent}
      </a>
      <Header />
      <OfflineBanner />
      <main
        id="main-content"
        className={cn(
          'page-enter flex-1',
          isMap ? 'min-h-0 overflow-hidden pb-0' : 'pb-nav-safe lg:pb-0'
        )}
        tabIndex={-1}
      >
        <Outlet />
      </main>
      {!isMap && (
        <footer className="border-t border-black/[0.04] bg-white/80 dark:border-white/[0.08] dark:bg-[#0c0c0e]/90">
          <div className="mx-auto max-w-7xl px-4 py-5 text-center sm:px-6 lg:px-8 lg:py-6">
            <p className="text-[12px] font-medium tracking-wide text-[#8e8e93] sm:text-[13px]">
              {t.common.developedBy}{' '}
              <span className="font-semibold text-[#1c1c1e] dark:text-white">Menelik Admasu</span>
            </p>
            <p className="mt-1 text-[11px] text-[#aeaeb2] dark:text-white/40">
              © {new Date().getFullYear()} Digital Bahir Dar
            </p>
          </div>
        </footer>
      )}
      {!isMap && <MobileNav />}
      {isMap && (
        <div className="lg:hidden">
          <MobileNav />
        </div>
      )}
      <InstallPrompt />
    </div>
  )
}
