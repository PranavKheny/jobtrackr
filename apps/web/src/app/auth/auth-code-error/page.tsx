import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
      <h1 className="text-3xl font-bold">Authentication Error</h1>
      <p className="text-muted-foreground mt-2">
        There was an error authenticating your magic link. It may have expired or already been used.
      </p>
      <Link
        href="/login"
        className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
      >
        Request a new link
      </Link>
    </div>
  )
}
