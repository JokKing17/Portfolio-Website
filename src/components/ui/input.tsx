import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      className={cn(
        'focus-ring flex h-12 w-full rounded-md border border-white/12 bg-white/[0.04] px-4 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary/60',
        className
      )}
      ref={ref}
      type={type}
      {...props}
    />
  )
)
Input.displayName = 'Input'
