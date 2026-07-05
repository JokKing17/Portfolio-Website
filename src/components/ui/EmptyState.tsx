import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title: string
  description?: string
  className?: string
}

export function EmptyState({ className, description, title }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-8 text-center',
        className
      )}
    >
      <Sparkles className="mx-auto mb-3 size-5 text-primary" />
      <p className="font-medium text-foreground">{title}</p>
      {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  )
}
