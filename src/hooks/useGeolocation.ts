import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store'
import {
  clearWatch,
  getCurrentPosition,
  geoErrorUserMessage,
  isGeolocationSupported,
  isInsideBahirDar,
  isNearBahirDar,
  queryGeoPermission,
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

  /** One-shot location request */
  const request = useCallback(async () => {
    if (!isGeolocationSupported()) {
      setLocation({ permission: 'unsupported' })
      setErrorCode('unsupported')
      setError(geoErrorUserMessage('unsupported'))
      return null
    }

    setLoading(true)
    setError(null)
    setErrorCode(null)

    try {
      const perm = await queryGeoPermission()
      if (perm === 'denied') {
        setLocation({ permission: 'denied' })
        setErrorCode('permission_denied')
        setError(geoErrorUserMessage('permission_denied'))
        return null
      }

      const pos = await getCurrentPosition()
      if (!mounted.current) return pos
      applyPosition(pos)
      return pos
    } catch (e) {
      if (mounted.current) applyError(e as GeoServiceError)
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
