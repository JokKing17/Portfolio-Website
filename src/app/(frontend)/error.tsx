'use client'

import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container grid min-h-screen place-items-center pt-20">
      <div className="max-w-lg text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-destructive">Error</p>
        <h1 className="text-4xl font-semibold">Something interrupted this page.</h1>
        <p className="mt-4 text-muted-foreground">Try loading it again.</p>
        <Button className="mt-8" onClick={reset} variant="outline">
          <RotateCcw className="size-4" />
          Try again
        </Button>
      </div>
    </div>
  )
}
