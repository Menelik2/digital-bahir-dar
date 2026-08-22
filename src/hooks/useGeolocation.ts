import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/store'

export function useGeolocation(auto = true) {
  const { location, setLocation } = useAppStore()

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation({ permission: 'unsupported' })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          permission: 'granted',
          lastUpdated: Date.now(),
        })
      },
      () => setLocation({ permission: 'denied' }),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60_000 }
    )
  }, [setLocation])

  useEffect(() => {
    if (auto && location.permission === 'prompt') request()
  }, [auto, location.permission, request])

  return { location, request, hasPosition: location.permission === 'granted' && location.latitude != null }
}
