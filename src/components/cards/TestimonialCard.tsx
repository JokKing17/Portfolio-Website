'use client'

import Image from 'next/image'
import { BadgeCheck, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn, getMedia, getMediaUrl } from '@/lib/utils'
import type { Testimonial } from '@/types/payload-types'

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const image = getMedia(testimonial.image)
  const imageUrl = getMediaUrl(testimonial.image)
  const rating = Math.min(Math.max(testimonial.rating || 5, 1), 5)
  return (
    <motion.article
      className="group h-full rounded-2xl border border-white/[0.14] bg-[rgba(13,18,27,0.96)] shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_16px_45px_rgba(0,0,0,0.24)] transition duration-300 hover:border-primary/30 hover:bg-[rgba(16,23,33,0.97)] hover:shadow-[0_20px_52px_rgba(0,0,0,0.3),0_0_28px_rgba(0,214,201,0.06)]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-2xl p-6 sm:min-h-[320px] sm:p-8">
        <blockquote className="line-clamp-6 text-[1.025rem] leading-[1.9] text-foreground/90 sm:text-[1.075rem] sm:leading-[1.95]">
          <span className="mr-0.5 text-primary/75">&ldquo;</span>
          {testimonial.message}
          <span className="ml-0.5 text-primary/75">&rdquo;</span>
        </blockquote>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/[0.1] pt-5 sm:pt-6">
          <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
            <div className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border border-primary/25 bg-white/[0.06] text-sm font-semibold text-primary shadow-[0_8px_24px_rgba(0,0,0,0.2)] sm:size-16">
              {imageUrl ? (
                <Image
                  alt={image?.alt || testimonial.name || 'Testimonial author'}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                  fill
                  sizes="64px"
                  src={imageUrl}
                />
              ) : (
                getInitials(testimonial.name)
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-base font-semibold leading-6 text-foreground">
                  {testimonial.name}
                </p>
                <BadgeCheck
                  aria-label="Verified testimonial"
                  className="size-4 shrink-0 fill-primary/15 text-primary"
                />
              </div>
              {testimonial.position ? (
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {testimonial.position}
                </p>
              ) : null}
              {testimonial.company ? (
                <p className="mt-0.5 truncate text-xs text-muted-foreground/70">
                  {testimonial.company}
                </p>
              ) : null}
            </div>
          </div>
          <div
            aria-label={`${rating} out of 5 stars`}
            className="testimonial-stars mb-0.5 flex shrink-0 gap-px rounded-full border border-secondary/25 bg-secondary/[0.1] px-2 py-1.5 text-secondary sm:gap-0.5 sm:px-3"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                className={cn('size-3 sm:size-3.5', index < rating ? 'fill-current' : 'opacity-25')}
                key={index}
                style={{ animationDelay: `${index * 55}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function getInitials(name?: string | null) {
  if (!name) return 'AI'

  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
