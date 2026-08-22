import { useEffect } from 'react'

/** Register public/sw.js in production; use ?sw=1 in dev to test */
export function useRegisterSW() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    if (import.meta.env.DEV) {
      if (!new URLSearchParams(location.search).has('sw')) return
    }
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
        reg.update().catch(() => {})
      } catch (e) {
        console.warn('SW register failed', e)
      }
    }
    register()
  }, [])
}
