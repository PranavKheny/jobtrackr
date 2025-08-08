'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold">
          JobTrackr
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  )
}
