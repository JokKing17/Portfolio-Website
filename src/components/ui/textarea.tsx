import * as React from 'react'
import { cn } from '@/lib/utils'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'focus-ring min-h-36 w-full resize-y rounded-lg border border-white/[0.14] bg-white/[0.055] px-4 py-3.5 text-sm leading-6 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] placeholder:text-muted-foreground/80 transition duration-300 hover:border-white/20 focus:border-primary/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(0,214,201,0.08)]',
      className
    )}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = 'Textarea'
