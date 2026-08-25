import { useEffect } from 'react'
import { useAppStore } from '@/store'

/** Apply `.dark` on <html> from zustand theme preference */
export function useThemeSync() {
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    const isDark = theme === 'dark'
    root.classList.toggle('dark', isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'
  }, [theme])
}

export function useThemeControls() {
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  /** Toggle: light → dark → light (default is always light first) */
  const cycle = () => setTheme(theme === 'light' ? 'dark' : 'light')
  return { theme, setTheme, cycle }
}
