import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'focus-ring inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md px-5 text-sm font-semibold transition duration-300 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-glow hover:bg-primary/90 hover:shadow-[0_0_48px_rgba(0,214,201,0.25)]',
        outline:
          'border border-white/14 bg-white/[0.03] text-foreground hover:border-primary/50 hover:bg-primary/10',
        ghost: 'hover:bg-white/8 hover:text-primary',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-6',
        icon: 'size-10 p-0'
      }
    },
    defaultVariants: {
      size: 'default',
      variant: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, size, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
