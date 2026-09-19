import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store'
import {
  clearWatch,
  getCurrentPositionRobust,
  getBestPosition,
  geoErrorUserMessage,
  isGeolocationSupported,
  isInsideBahirDar,
  isNearBahirDar,
  watchPosition,
  type GeoPosition,
  type GeoServiceError,
} from '@/services/geolocation'

export type UseGeolocationOptions = {
  /** Request a one-shot fix on mount */
  autoRequest?: boolean
  /** Keep updating position while mounted */
  watch?: boolean
}

/**
 * App-wide geolocation: reads/writes Zustand location state,
 * supports one-shot + continuous watch, and Bahir Dar context flags.
 */
export function useGeolocation(options?: UseGeolocationOptions | boolean) {
  const opts: UseGeolocationOptions =
    typeof options === 'boolean' ? { autoRequest: options } : options ?? {}

  const { location, setLocation } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [watching, setWatching] = useState(false)
  const watchIdRef = useRef(-1)
  const mounted = useRef(true)
  const lastErrorRef = useRef<string | null>(null)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearWatch(watchIdRef.current)
    }
  }, [])

  const applyPosition = useCallback(
    (pos: GeoPosition) => {
      setLocation({
        latitude: pos.latitude,
        longitude: pos.longitude,
        accuracy: pos.accuracy,
        permission: 'granted',
        lastUpdated: Date.now(),
      })
      setError(null)
      setErrorCode(null)
    },
    [setLocation]
  )

  const applyError = useCallback(
    (err: GeoServiceError) => {
      setError(err.message)
      setErrorCode(err.code)
      if (err.code === 'permission_denied') {
        setLocation({ permission: 'denied' })
      } else if (err.code === 'unsupported') {
        setLocation({ permission: 'unsupported' })
      }
    },
    [setLocation]
  )

  /**
   * One-shot location request.
   * Returns position on success, or null on failure.
   */
  const request = useCallback(async (): Promise<GeoPosition | null> => {
    if (!isGeolocationSupported()) {
      const msg = geoErrorUserMessage('unsupported')
      setLocation({ permission: 'unsupported' })
      setErrorCode('unsupported')
      setError(msg)
      lastErrorRef.current = msg
      return null
    }

    setLoading(true)
    setError(null)
    setErrorCode(null)
    lastErrorRef.current = null

    try {
      // Sample GPS for a few seconds — first fix is often inaccurate
      let pos: GeoPosition
      try {
        pos = await getBestPosition(10_000)
      } catch {
        pos = await getCurrentPositionRobust()
      }
      if (!mounted.current) return pos
      // Only keep coords that make sense for this city map (avoids VPN / wrong-country pin)
      if (isNearBahirDar(pos.latitude, pos.longitude, 80_000)) {
        applyPosition(pos)
      } else {
        // Still return pos so callers can show a "far / VPN" message; do not pin on map
        setLocation({
          latitude: null,
          longitude: null,
          accuracy: null,
          permission: 'granted',
          lastUpdated: null,
        })
      }
      lastErrorRef.current = null
      return pos
    } catch (e) {
      const err = e as GeoServiceError
      const msg = err?.message || geoErrorUserMessage(err?.code)
      lastErrorRef.current = msg
      if (mounted.current) applyError(err)
      return null
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [applyError, applyPosition, setLocation])

  /** Start continuous tracking */
  const startWatch = useCallback(() => {
    if (!isGeolocationSupported()) {
      applyError({
        name: 'GeoServiceError',
        message: geoErrorUserMessage('unsupported'),
        code: 'unsupported',
      } as GeoServiceError)
      return
    }
    clearWatch(watchIdRef.current)
    setWatching(true)
    setError(null)
    watchIdRef.current = watchPosition(
      (pos) => {
        if (mounted.current && isNearBahirDar(pos.latitude, pos.longitude, 80_000)) {
          applyPosition(pos)
        }
      },
      (err) => {
        if (mounted.current) {
          applyError(err)
          setWatching(false)
        }
      }
    )
  }, [applyError, applyPosition])

  const stopWatch = useCallback(() => {
    clearWatch(watchIdRef.current)
    watchIdRef.current = -1
    setWatching(false)
  }, [])

  // Auto one-shot
  useEffect(() => {
    if (
      opts.autoRequest &&
      location.latitude == null &&
      (location.permission === 'prompt' || location.permission === 'granted')
    ) {
      void request()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.autoRequest])

  // Continuous watch
  useEffect(() => {
    if (opts.watch) {
      startWatch()
      return () => stopWatch()
    }
    return undefined
  }, [opts.watch, startWatch, stopWatch])

  const hasFix = location.latitude != null && location.longitude != null
  const insideBahirDar =
    hasFix && location.latitude != null && location.longitude != null
      ? isInsideBahirDar(location.latitude, location.longitude)
      : false
  const nearBahirDar =
    hasFix && location.latitude != null && location.longitude != null
      ? isNearBahirDar(location.latitude, location.longitude)
      : false

  const getLastError = useCallback(() => lastErrorRef.current, [])

  return {
    location,
    loading,
    error,
    errorCode,
    watching,
    hasFix,
    insideBahirDar,
    nearBahirDar,
    request,
    startWatch,
    stopWatch,
    getLastError,
  }
}
