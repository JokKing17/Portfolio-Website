import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container grid min-h-screen place-items-center pt-20">
      <div className="max-w-lg text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-primary">Not Found</p>
        <h1 className="text-4xl font-semibold">This page is not available.</h1>
        <p className="mt-4 text-muted-foreground">The content may have moved or is not published.</p>
        <Button asChild className="mt-8" variant="outline">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back home
          </Link>
        </Button>
      </div>
    </div>
  )
}
