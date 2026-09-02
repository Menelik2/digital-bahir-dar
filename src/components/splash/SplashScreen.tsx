import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

const SESSION_KEY = 'dbd-splash-seen'
/** Total time splash is visible before exit animation */
const HOLD_MS = 1800
/** Exit fade duration */
const EXIT_MS = 550

type Props = {
  /** Force show every load (dev). Default: once per browser session */
  always?: boolean
  onDone?: () => void
}

/**
 * Modern flash / splash before the app UI.
 * Shows once per session, then fades out.
 */
export function SplashScreen({ always = false, onDone }: Props) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'gone'>('in')

  useEffect(() => {
    if (!always) {
      try {
        if (sessionStorage.getItem(SESSION_KEY) === '1') {
          setPhase('gone')
          onDone?.()
          return
        }
      } catch {
        /* private mode */
      }
    }

    const tHold = window.setTimeout(() => setPhase('out'), HOLD_MS)
    const tGone = window.setTimeout(() => {
      setPhase('gone')
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        /* ignore */
      }
      onDone?.()
    }, HOLD_MS + EXIT_MS)

    return () => {
      window.clearTimeout(tHold)
      window.clearTimeout(tGone)
    }
  }, [always, onDone])

  if (phase === 'gone') return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden',
        'bg-gradient-to-br from-[#056b24] via-[#0b6e99] to-[#0a4d6e]',
        phase === 'out' && 'splash-exit'
      )}
      role="status"
      aria-live="polite"
      aria-label="Digital Bahir Dar loading"
    >
      {/* Animated mesh + orbs */}
      <div className="ethio-mesh pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="splash-orb splash-orb-a" aria-hidden />
      <div className="splash-orb splash-orb-b" aria-hidden />
      <div className="splash-orb splash-orb-c" aria-hidden />

      {/* Flag accent */}
      <div className="ethio-flag-bar absolute inset-x-0 top-0" aria-hidden />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Logo mark */}
        <div className="splash-logo-wrap mb-6">
          <div className="splash-logo-ring" aria-hidden />
          <div className="splash-logo-mark">
            <MapPin className="h-9 w-9 text-white sm:h-10 sm:w-10" strokeWidth={2.25} />
          </div>
        </div>

        <h1 className="splash-title text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Digital Bahir Dar
        </h1>
        <p className="splash-sub mt-2 max-w-xs text-sm font-medium text-[#f5c518]/95 sm:text-base">
          Explore · Plan · Discover
        </p>

        {/* Progress bar */}
        <div className="splash-bar mt-8 h-1 w-40 overflow-hidden rounded-full bg-white/20 sm:w-48">
          <div className="splash-bar-fill h-full rounded-full bg-[#f5c518]" />
        </div>
      </div>

      <p className="splash-footer absolute bottom-10 text-[11px] font-medium tracking-wide text-white/50">
        Bahir Dar · Lake Tana · Ethiopia
      </p>
    </div>
  )
}
