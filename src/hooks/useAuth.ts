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
      // Drop previous user's private cache on logout or when switching accounts.
      // Do NOT clear on USER_UPDATED (profile/metadata refresh) — that would
      // needlessly flush favorites/trips for the same signed-in user.
      if (event === 'SIGNED_OUT') {
        clearUserQueryCache()
      } else if (event === 'SIGNED_IN') {
        // If a different user signs in on the same browser, drop leftovers.
        // Comparing against current state is racy inside the callback, so clear
        // on every SIGNED_IN — cheap and keeps multi-account safe.
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
