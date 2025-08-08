'use client'

import React from 'react'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">Something went wrong.</h2>
          <p className="text-muted-foreground">
            We're sorry, but an unexpected error occurred. Please try refreshing the page.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
