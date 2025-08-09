import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'

const features = [
  'Organize your job search in one place',
  'Track progress from applied to offer',
  'Analyze your application history',
  'Never miss a deadline or follow-up',
]

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold">
          Track your job applications effortlessly
        </h1>
        <p className="text-muted-foreground mt-4 md:text-xl">
          JobTrackr is the smart, simple way to manage your job applications and stay on top of your career goals.
        </p>
        <div className="flex gap-4 mt-8 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 max-w-4xl w-full">
        <h2 className="text-3xl font-bold">Why you'll love JobTrackr</h2>
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">{feature}</h3>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
