import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { useAppStore } from '@/store'
import { useEffect } from 'react'

export function Layout() {
  const { isOnline, setIsOnline } = useAppStore()
  useEffect(() => {
    const on = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    setIsOnline(navigator.onLine)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [setIsOnline])

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      {!isOnline && <div className="bg-amber-500 px-4 py-1.5 text-center text-sm font-medium text-white">🟠 Offline — showing saved information</div>}
      <main className="flex-1 pb-20 lg:pb-0"><Outlet /></main>
      <MobileNav />
    </div>
  )
}
