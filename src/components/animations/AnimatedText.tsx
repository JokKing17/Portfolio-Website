'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type AnimatedTextProps = {
  text?: string
  className?: string
}

export function AnimatedText({ className, text = '' }: AnimatedTextProps) {
  const words = text.split(' ')

  return (
    <span className={cn('inline-block', className)}>
      {words.map((word, index) => (
        <motion.span
          className="inline-block overflow-hidden align-bottom"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.045, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          key={`${word}-${index}`}
        >
          {word}
          {index < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
}
