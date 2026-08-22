import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { clearUserQueryCache } from '@/lib/queryClient'
import type { User, Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      // Drop previous user's private cache on logout / user switch
      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        if (event === 'SIGNED_OUT') clearUserQueryCache()
      }
      if (event === 'SIGNED_IN') {
        // Ensure we don't keep another account's leftovers
        clearUserQueryCache()
      }

      setSession(s)
      setUser(s?.user ?? null)
      setLoading(false)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    clearUserQueryCache()
  }

  return { user, session, loading, signOut, isAuthenticated: !!user }
}
