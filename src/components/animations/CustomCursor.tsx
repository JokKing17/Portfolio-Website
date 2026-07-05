'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export function CustomCursor({ enabled = true }: { enabled?: boolean }) {
  const isTouch = useMediaQuery('(pointer: coarse)')
  const [active, setActive] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const x = useSpring(cursorX, { damping: 30, stiffness: 420 })
  const y = useSpring(cursorY, { damping: 30, stiffness: 420 })

  useEffect(() => {
    if (!enabled || isTouch) return

    const move = (event: PointerEvent) => {
      cursorX.set(event.clientX)
      cursorY.set(event.clientY)
    }

    const activate = (event: Event) => {
      const target = event.target as HTMLElement
      setActive(Boolean(target.closest('a, button, input, textarea, select')))
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', activate)

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', activate)
    }
  }, [cursorX, cursorY, enabled, isTouch])

  if (!enabled || isTouch) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden size-8 rounded-full border border-primary/70 mix-blend-screen md:block"
      style={{ x, y }}
      animate={{
        marginLeft: active ? -22 : -16,
        marginTop: active ? -22 : -16,
        scale: active ? 1.45 : 1
      }}
      transition={{ duration: 0.18 }}
    />
  )
}
