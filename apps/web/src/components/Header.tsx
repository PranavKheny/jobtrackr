'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { Button } from './ui/Button'
import { createClient } from '@/lib/supabase'

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export default function Header() {
  const router = useRouter()
  const { session } = useAuth()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {isDemoMode && (
        <div className="bg-yellow-500 text-center p-2 text-sm text-black">
          Demo Mode: Writes are disabled.
        </div>
      )}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-2xl font-bold">
            JobTrackr
          </Link>
          <nav className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{session.user.email}</span>
                  <Button variant="secondary" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}
