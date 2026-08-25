import { useEffect } from 'react'
import { useAppStore } from '@/store'

const THEME_KEY = 'dbd-theme'

export function applyThemeToDom(theme: 'light' | 'dark') {
  const root = document.documentElement
  const isDark = theme === 'dark'
  root.classList.toggle('dark', isDark)
  root.style.colorScheme = isDark ? 'dark' : 'light'
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* private mode / quota */
  }
  // Keep PWA status bar / browser chrome in sync
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', isDark ? '#0f172a' : '#078930')
}

/** Apply `.dark` on <html> and persist to localStorage */
export function useThemeSync() {
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    applyThemeToDom(theme)
  }, [theme])
}

export function useThemeControls() {
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)

  const cycle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    applyThemeToDom(next)
  }

  return { theme, setTheme, cycle }
}
