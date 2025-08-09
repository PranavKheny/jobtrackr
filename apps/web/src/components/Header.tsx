'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { Button } from './ui/Button'

export default function Header() {
  const router = useRouter()
  const { session } = useAuth()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="flex items-center justify-between py-4">
      <button className="text-xl font-bold" onClick={() => router.push('/')}>
        JobTrackr
      </button>
      <nav className="flex items-center gap-3">
        {session ? (
          <>
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="secondary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <Button onClick={() => router.push('/login')}>Sign In</Button>
        )}
      </nav>
    </header>
  )
}
