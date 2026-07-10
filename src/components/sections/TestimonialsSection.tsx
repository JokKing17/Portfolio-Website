'use client'

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
  const loopDuration = Math.min(65, Math.max(45, testimonials.length * 9))

  return (
    <section className="section-shell container relative" id="testimonials">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[min(90vw,64rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.055] blur-[110px]"
      />
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
        <div className="testimonial-marquee w-full overflow-hidden py-2">
          <div
            className="testimonial-marquee-track"
            style={{ animationDelay: '4.5s', animationDuration: `${loopDuration}s` }}
          >
            {[0, 1].map((copy) => (
              <div aria-hidden={copy === 1} className="testimonial-marquee-group" key={copy}>
                {testimonials.map((testimonial) => (
                  <div
                    className="w-[min(34rem,calc(100vw-3rem))] shrink-0"
                    key={testimonial.id}
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
