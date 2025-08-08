import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
      <h1 className="text-5xl font-bold">Welcome to JobTrackr</h1>
      <p className="text-muted-foreground mt-4 max-w-xl">
        The smart, simple way to manage your job applications and stay on top of your career goals.
      </p>
      <div className="flex gap-4 mt-8">
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </div>
  )
}
