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
      className="fixed left-3 right-3 z-50 mx-auto max-w-md rounded-[1.15rem] border border-black/[0.06] bg-white/95 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-white/[0.1] dark:bg-[#1c1c1e]/95 sm:bottom-6 lg:bottom-6"
      style={{
        // Above mobile tab bar; desktop uses bottom-6 via classes
        bottom: 'calc(5.75rem + env(safe-area-inset-bottom, 0px))',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.85rem] bg-[#0b6e99]/12 text-[#0b6e99] dark:bg-sky-950 dark:text-sky-300">
          <Download className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white">
            {t.pwa.installTitle}
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-[#8e8e93]">{t.pwa.installBody}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" className="min-h-[40px] px-4" onClick={install}>
              {t.pwa.install}
            </Button>
            <Button size="sm" variant="ghost" className="min-h-[40px]" onClick={dismiss}>
              {t.pwa.dismiss}
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#8e8e93] active:bg-black/5 dark:active:bg-white/10"
          aria-label={t.pwa.dismiss}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
