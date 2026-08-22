import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMyTrips,
  fetchTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  addTripDay,
  addTripStop,
  deleteTripStop,
  addExpense,
  deleteExpense,
  createDemoTrip,
} from '@/services/trips'
import type { TripInput } from '@/types/trip'
import { useAuth } from './useAuth'
import { useTripDetailRealtime } from './useRealtimeQueries'

export function useMyTrips() {
  const { user } = useAuth()
  // trips list realtime is global in RealtimeProvider — no second channel here

  return useQuery({
    queryKey: ['trips', user?.id],
    queryFn: async () => {
      if (!user) return []
      const trips = await fetchMyTrips(user.id)
      if (trips.length === 0) return [createDemoTrip(user.id)]
      return trips
    },
    enabled: !!user,
    staleTime: 30_000,
  })
}

export function useTrip(tripId: string | undefined) {
  const { user } = useAuth()
  const live = useTripDetailRealtime(tripId)

  const query = useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      if (tripId === 'demo-trip-1' && user) return createDemoTrip(user.id)
      return fetchTrip(tripId!)
    },
    enabled: !!tripId,
    staleTime: 30_000,
  })

  return { ...query, realtime: live }
}

export function useCreateTrip() {
  const { user } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: TripInput) => {
      if (!user) throw new Error('Sign in to create a trip')
      const res = await createTrip(user.id, input)
      if (res.error) throw new Error(res.error)
      return res.trip!
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips', user?.id] }),
  })
}

export function useUpdateTrip(tripId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Partial<TripInput>) => {
      const res = await updateTrip(tripId, input)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trip', tripId] })
      qc.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}

export function useDeleteTrip() {
  const { user } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (tripId: string) => {
      if (tripId.startsWith('demo-')) return
      const res = await deleteTrip(tripId)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips', user?.id] }),
  })
}

export function useAddDay(tripId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dayNumber: number) => {
      const res = await addTripDay(tripId, dayNumber)
      if (res.error) throw new Error(res.error)
      return res.day!
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip', tripId] }),
  })
}

export function useAddStop(tripId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (args: {
      tripDayId: string
      custom_name?: string
      place_id?: string
      estimated_cost?: number
    }) => {
      const res = await addTripStop(args.tripDayId, args)
      if (res.error) throw new Error(res.error)
      return res.stop!
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip', tripId] }),
  })
}

export function useDeleteStop(tripId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (stopId: string) => {
      const res = await deleteTripStop(stopId)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip', tripId] }),
  })
}

export function useAddExpense(tripId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (expense: {
      category: string
      title: string
      amount: number
      is_estimated?: boolean
    }) => {
      const res = await addExpense(tripId, expense)
      if (res.error) throw new Error(res.error)
      return res.expense!
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip', tripId] }),
  })
}

export function useDeleteExpense(tripId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (expenseId: string) => {
      const res = await deleteExpense(expenseId)
      if (res.error) throw new Error(res.error)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip', tripId] }),
  })
}
