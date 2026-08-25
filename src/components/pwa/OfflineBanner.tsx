import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'
import { useT } from '@/hooks/useT'

export function OfflineBanner() {
  const t = useT()
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-2 bg-amber-500 px-3 py-1.5 text-center text-xs font-medium text-amber-950"
    >
      <WifiOff className="h-3.5 w-3.5" />
      {t.pwa.offline}
    </div>
  )
}
