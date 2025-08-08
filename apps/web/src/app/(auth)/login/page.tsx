'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { useToast } from '@/components/Toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()
  const { addToast } = useToast()

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(false)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/callback',
      },
    })
    if (error) {
      addToast('Failed to send magic link. Please try again.', 'error')
    } else {
      setSubmitted(true)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm space-y-4"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">
            Enter your email to sign in with a magic link.
          </p>
        </div>
        {submitted ? (
          <div className="text-center p-4 bg-secondary rounded-md">
            <p>Please check your email for the magic link.</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full p-2 bg-input rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Send Magic Link
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}
