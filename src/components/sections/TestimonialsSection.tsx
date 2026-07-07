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
  return (
    <section className="section-shell container" id="testimonials">
      <SectionHeading
        eyebrow="Trust"
        title={heading || 'Testimonials'}
        description="A cleaner look at feedback from collaborators, clients, and project stakeholders."
      />
      {!testimonials.length ? (
        <EmptyState title="No testimonials published yet." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      )}
    </section>
  )
}
