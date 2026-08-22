import { useCallback, useState } from 'react'
import { useAppStore } from '@/store'

export function useGeolocation() {
  const { location, setLocation } = useAppStore()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation({ permission: 'unsupported' })
      setError('unsupported')
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          permission: 'granted',
          lastUpdated: Date.now(),
        })
        setLoading(false)
      },
      (err) => {
        setLocation({ permission: 'denied' })
        setError(err.message || 'denied')
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 }
    )
  }, [setLocation])

  const hasFix = location.latitude != null && location.longitude != null

  return { location, request, loading, error, hasFix }
}
