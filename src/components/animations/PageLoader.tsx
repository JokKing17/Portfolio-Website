'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function PageLoader({ enabled = true, siteName }: { enabled?: boolean; siteName?: string }) {
  const [visible, setVisible] = useState(enabled)

  useEffect(() => {
    if (!enabled) return

    const timeout = window.setTimeout(() => setVisible(false), 950)
    return () => window.clearTimeout(timeout)
  }, [enabled])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-background"
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <div className="text-center">
            <div className="mx-auto mb-5 size-12 rounded-full border border-primary/20 border-t-primary" />
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              {siteName || 'Loading'}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
