import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface LocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  permission: 'granted' | 'denied' | 'prompt' | 'unsupported'
  lastUpdated: number | null
}

interface AppState {
  location: LocationState
  setLocation: (loc: Partial<LocationState>) => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  language: 'en' | 'am'
  setLanguage: (lang: 'en' | 'am') => void
  currency: 'ETB' | 'USD' | 'EUR' | 'GBP'
  setCurrency: (c: 'ETB' | 'USD' | 'EUR' | 'GBP') => void
  selectedPlaceId: string | null
  setSelectedPlaceId: (id: string | null) => void
  mapCenter: { lat: number; lng: number }
  setMapCenter: (c: { lat: number; lng: number }) => void
  isOnline: boolean
  setIsOnline: (v: boolean) => void
}

const BAHIR_DAR = { lat: 11.5936, lng: 37.3908 }

function normalizeTheme(value: unknown): 'light' | 'dark' {
  return value === 'dark' ? 'dark' : 'light'
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      location: { latitude: null, longitude: null, accuracy: null, permission: 'prompt', lastUpdated: null },
      setLocation: (loc) => set((s) => ({ location: { ...s.location, ...loc } })),
      theme: 'light',
      setTheme: (theme) => {
        const next = normalizeTheme(theme)
        try {
          localStorage.setItem('dbd-theme', next)
        } catch {
          /* ignore */
        }
        set({ theme: next })
      },
      language: 'en',
      setLanguage: (language) => set({ language }),
      currency: 'ETB',
      setCurrency: (currency) => set({ currency }),
      selectedPlaceId: null,
      setSelectedPlaceId: (selectedPlaceId) => set({ selectedPlaceId }),
      mapCenter: BAHIR_DAR,
      setMapCenter: (mapCenter) => set({ mapCenter }),
      isOnline: true,
      setIsOnline: (isOnline) => set({ isOnline }),
    }),
    {
      name: 'digital-bahir-dar',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        theme: s.theme,
        language: s.language,
        currency: s.currency,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>
        return {
          ...current,
          ...p,
          theme: normalizeTheme(p.theme),
        }
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const theme = normalizeTheme(state.theme)
        try {
          localStorage.setItem('dbd-theme', theme)
        } catch {
          /* ignore */
        }
        if (typeof document !== 'undefined') {
          const root = document.documentElement
          root.classList.toggle('dark', theme === 'dark')
          root.style.colorScheme = theme === 'dark' ? 'dark' : 'light'
        }
      },
    }
  )
)
