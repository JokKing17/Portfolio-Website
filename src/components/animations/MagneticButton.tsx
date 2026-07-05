'use client'

import type { ReactNode } from 'react'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

type MagneticButtonProps = {
  children: ReactNode
  className?: string
}

export function MagneticButton({ children, className }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { damping: 18, stiffness: 180 })
  const springY = useSpring(y, { damping: 18, stiffness: 180 })

  return (
    <motion.div
      className={cn('inline-flex', className)}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      onMouseMove={(event) => {
        const bounds = ref.current?.getBoundingClientRect()
        if (!bounds) return

        x.set((event.clientX - bounds.left - bounds.width / 2) * 0.22)
        y.set((event.clientY - bounds.top - bounds.height / 2) * 0.22)
      }}
      ref={ref}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  )
}
