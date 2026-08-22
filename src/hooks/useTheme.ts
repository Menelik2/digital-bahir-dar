import { useEffect } from 'react'
import { useAppStore } from '@/store'

function resolveDark(theme: 'light' | 'dark' | 'system'): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** Apply `.dark` on <html> from zustand theme preference */
export function useThemeSync() {
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      root.classList.toggle('dark', resolveDark(theme))
      root.style.colorScheme = resolveDark(theme) ? 'dark' : 'light'
    }
    apply()

    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])
}

export function useThemeControls() {
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const cycle = () => {
    const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'
    setTheme(next)
  }
  return { theme, setTheme, cycle }
}
