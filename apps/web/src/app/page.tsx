'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/Toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // hard-coded for local dev
        emailRedirectTo: 'http://localhost:3000/auth/callback',
      },
    })

    setLoading(false)
    if (error) {
      addToast(error.message, 'error')
      return
    }
    addToast('Magic link sent! Check your email.', 'success')
  }

  return (
    <main className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-6">Welcome Back</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Send Magic Link'}
        </Button>
      </form>
    </main>
  )
}
