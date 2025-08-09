'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase'
import { Button } from './ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/DropdownMenu'
import { ThemeToggle } from './ThemeToggle'
import { User, LogOut } from 'lucide-react'

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
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            {/* Placeholder for a logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 22a10 10 0 1 0-8.49-4.88" />
              <path d="M12 2a10 10 0 1 0 8.49 4.88" />
              <path d="M12 12a5 5 0 1 0-2.5 4.33" />
              <path d="M12 12a5 5 0 1 0 2.5-4.33" />
            </svg>
            JobTrackr
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" disabled>
                    {session.user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
