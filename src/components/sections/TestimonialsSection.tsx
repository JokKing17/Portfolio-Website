'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { TestimonialCard } from '@/components/cards/TestimonialCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Testimonial } from '@/types/payload-types'

export function TestimonialsSection({
  heading,
  testimonials
}: {
  heading?: string
  testimonials: Testimonial[]
}) {
  const [page, setPage] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const pageCount = Math.ceil(testimonials.length / 2)
  const activePage = pageCount ? page % pageCount : 0
  const visibleTestimonials =
    testimonials.length <= 2
      ? testimonials
      : [
          testimonials[(activePage * 2) % testimonials.length],
          testimonials[(activePage * 2 + 1) % testimonials.length]
        ]

  useEffect(() => {
    if (pageCount <= 1 || isPaused || prefersReducedMotion) return

    const interval = window.setInterval(() => {
      setPage((currentPage) => (currentPage + 1) % pageCount)
    }, 6000)

    return () => window.clearInterval(interval)
  }, [isPaused, pageCount, prefersReducedMotion])

  return (
    <section className="section-shell container relative" id="testimonials">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[min(90vw,64rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.055] blur-[110px]" />
      <div className="mb-12 [&>div]:mb-0 sm:mb-14">
        <SectionHeading
          eyebrow="Trust"
          title={heading || 'Testimonials'}
          description="A few words from people I've collaborated with."
        />
      </div>
      {!testimonials.length ? (
        <EmptyState title="No testimonials published yet." />
      ) : (
        <div
          className="mx-auto max-w-[1120px] overflow-hidden py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 md:grid-cols-2 md:gap-5 lg:gap-7"
              exit={{ opacity: 0, y: -28 }}
              initial={{ opacity: 0, y: 28 }}
              key={activePage}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {visibleTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}
