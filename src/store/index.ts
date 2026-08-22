import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
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

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      location: { latitude: null, longitude: null, accuracy: null, permission: 'prompt', lastUpdated: null },
      setLocation: (loc) => set((s) => ({ location: { ...s.location, ...loc } })),
      theme: 'system',
      setTheme: (theme) => set({ theme }),
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
      partialize: (s) => ({ theme: s.theme, language: s.language, currency: s.currency }),
    }
  )
)
