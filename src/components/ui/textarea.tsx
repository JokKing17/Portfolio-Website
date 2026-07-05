import * as React from 'react'
import { cn } from '@/lib/utils'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'focus-ring min-h-36 w-full rounded-md border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary/60',
      className
    )}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = 'Textarea'
