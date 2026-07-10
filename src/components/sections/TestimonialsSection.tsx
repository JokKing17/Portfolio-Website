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
  const featuredTestimonials = testimonials.slice(0, 2)

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
        <div className="mx-auto grid max-w-[1120px] gap-6 md:grid-cols-2 md:gap-5 lg:gap-7">
          {featuredTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      )}
    </section>
  )
}
