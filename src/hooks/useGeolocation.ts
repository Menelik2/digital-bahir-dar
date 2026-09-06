import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store'
import {
  clearWatch,
  getCurrentPositionRobust,
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
export function useGeolocation(autoRequestOrOpts: boolean | UseGeolocationOptions = false) {
  const opts: UseGeolocationOptions =
    typeof autoRequestOrOpts === 'boolean'
      ? { autoRequest: autoRequestOrOpts, watch: false }
      : autoRequestOrOpts

  const { location, setLocation } = useAppStore()
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [watching, setWatching] = useState(false)
  const watchIdRef = useRef<number>(-1)
  const mounted = useRef(true)
  const lastErrorRef = useRef<string | null>(null)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearWatch(watchIdRef.current)
      watchIdRef.current = -1
    }
  }, [])

  const applyPosition = useCallback(
    (pos: GeoPosition) => {
      setLocation({
        latitude: pos.latitude,
        longitude: pos.longitude,
        accuracy: pos.accuracy,
        permission: 'granted',
        lastUpdated: pos.timestamp,
      })
      setError(null)
      setErrorCode(null)
    },
    [setLocation]
  )

  const applyError = useCallback(
    (err: GeoServiceError | Error) => {
      const code = 'code' in err ? String(err.code) : 'unknown'
      setErrorCode(code)
      setError(err.message || geoErrorUserMessage(code))
      if (code === 'permission_denied') {
        setLocation({ permission: 'denied' })
      } else if (code === 'unsupported') {
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
      // Always call the browser API so the user gets the native prompt.
      // Permissions API alone is unreliable across Safari / embedded browsers.
      const pos = await getCurrentPositionRobust()
      if (!mounted.current) return pos
      applyPosition(pos)
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
        if (mounted.current) applyPosition(pos)
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

  // Optional continuous watch for map pages
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

  return {
    location,
    request,
    /** Synchronous last error message from the most recent request() call */
    getLastError: () => lastErrorRef.current,
    startWatch,
    stopWatch,
    loading,
    watching,
    error,
    errorCode,
    hasFix,
    insideBahirDar,
    nearBahirDar,
    supported: isGeolocationSupported(),
  }
}
