import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'
import { OfflineBanner } from '@/components/pwa/OfflineBanner'
import { useRegisterSW } from '@/hooks/useRegisterSW'
import { useThemeSync } from '@/hooks/useTheme'
import { useDocumentLang, useT } from '@/hooks/useT'

export function Layout() {
  useRegisterSW()
  useThemeSync()
  useDocumentLang()
  const t = useT()

  return (
    <div className="flex min-h-full flex-col bg-[#f2f2f7] dark:bg-black">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        {t.common.skipToContent}
      </a>
      <Header />
      <OfflineBanner />
      <main id="main-content" className="flex-1 pb-nav-safe lg:pb-0" tabIndex={-1}>
        <Outlet />
      </main>
      <MobileNav />
      <InstallPrompt />
    </div>
  )
}
