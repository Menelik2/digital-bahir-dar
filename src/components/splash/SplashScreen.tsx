import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Visible hold before exit */
const HOLD_MS = 2200
/** Exit animation length */
const EXIT_MS = 600

type Props = {
  onDone?: () => void
}

/**
 * Modern flash animation before the website opens.
 * Plays on every full page load, then fades into the app.
 */
export function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<'flash' | 'brand' | 'out' | 'gone'>('flash')

  useEffect(() => {
    // Brief white flash → brand hold → exit
    const tBrand = window.setTimeout(() => setPhase('brand'), 280)
    const tOut = window.setTimeout(() => setPhase('out'), HOLD_MS)
    const tGone = window.setTimeout(() => {
      setPhase('gone')
      onDone?.()
    }, HOLD_MS + EXIT_MS)

    return () => {
      window.clearTimeout(tBrand)
      window.clearTimeout(tOut)
      window.clearTimeout(tGone)
    }
  }, [onDone])

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
      aria-label="Digital Bahir Dar"
    >
      {/* Opening flash flare */}
      <div
        className={cn('splash-flash-flare', phase !== 'flash' && 'splash-flash-flare-done')}
        aria-hidden
      />

      <div className="ethio-mesh pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="splash-orb splash-orb-a" aria-hidden />
      <div className="splash-orb splash-orb-b" aria-hidden />
      <div className="splash-orb splash-orb-c" aria-hidden />

      {/* Flag sweep */}
      <div className="splash-flag-sweep" aria-hidden />
      <div className="ethio-flag-bar absolute inset-x-0 top-0 z-20" aria-hidden />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="splash-logo-wrap mb-6">
          <div className="splash-logo-ring" aria-hidden />
          <div className="splash-logo-ring splash-logo-ring-delay" aria-hidden />
          <div className="splash-logo-mark">
            <MapPin className="h-9 w-9 text-white sm:h-11 sm:w-11" strokeWidth={2.25} />
          </div>
        </div>

        <h1 className="splash-title text-[1.65rem] font-bold tracking-tight text-white sm:text-4xl">
          Digital Bahir Dar
        </h1>
        <p className="splash-sub mt-2.5 text-sm font-semibold tracking-wide text-[#f5c518] sm:text-base">
          Explore · Plan · Discover
        </p>

        <div className="splash-bar mt-9 h-1.5 w-44 overflow-hidden rounded-full bg-white/20 sm:w-56">
          <div className="splash-bar-fill h-full rounded-full bg-gradient-to-r from-[#f5c518] via-white to-[#f5c518]" />
        </div>

        <p className="splash-tagline mt-5 text-[12px] text-white/70 sm:text-[13px]">
          Smart Digital City · Lake Tana
        </p>
      </div>

      <p className="splash-footer absolute bottom-10 text-[11px] font-medium tracking-wider text-white/45 uppercase">
        Bahir Dar · Ethiopia
      </p>
    </div>
  )
}
