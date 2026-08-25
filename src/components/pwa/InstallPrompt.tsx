import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useT } from '@/hooks/useT'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'dbd-install-dismissed'

export function InstallPrompt() {
  const t = useT()
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === '1') return
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!visible || !deferred) return null

  const install = async () => {
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    setVisible(false)
    if (outcome === 'dismissed') localStorage.setItem(DISMISS_KEY, '1')
  }

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label={t.pwa.installTitle}
      className="fixed bottom-20 left-3 right-3 z-50 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:bottom-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          <Download className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{t.pwa.installTitle}</p>
          <p className="mt-0.5 text-xs text-slate-500">{t.pwa.installBody}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={install}>{t.pwa.install}</Button>
            <Button size="sm" variant="ghost" onClick={dismiss}>{t.pwa.dismiss}</Button>
          </div>
        </div>
        <button type="button" onClick={dismiss} className="rounded p-1 text-slate-400 hover:text-slate-600" aria-label={t.pwa.dismiss}>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
