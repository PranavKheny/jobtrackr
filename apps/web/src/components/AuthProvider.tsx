'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

type AuthCtx = {
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthCtx>({ session: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // use the already-created client
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // initialize from current session
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session ?? null)
      setLoading(false)
    })

    // keep session in sync
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
