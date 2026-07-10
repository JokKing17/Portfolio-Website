'use client'

import Image from 'next/image'
import { BadgeCheck, Quote, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn, getMedia, getMediaUrl } from '@/lib/utils'
import type { Testimonial } from '@/types/payload-types'

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const image = getMedia(testimonial.image)
  const imageUrl = getMediaUrl(testimonial.image)
  const rating = Math.min(Math.max(testimonial.rating || 5, 1), 5)
  return (
    <motion.article
      className="group h-full rounded-2xl border border-white/[0.14] bg-[rgba(13,18,27,0.96)] shadow-[0_16px_45px_rgba(0,0,0,0.24)] transition duration-300 hover:border-primary/30 hover:shadow-[0_20px_52px_rgba(0,0,0,0.3)]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="relative flex h-full min-h-[350px] flex-col overflow-hidden rounded-2xl p-6 sm:min-h-[370px] sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <span className="grid size-12 place-items-center rounded-xl border border-primary/25 bg-primary/[0.1] text-primary transition duration-300 group-hover:scale-[1.03] group-hover:border-primary/35">
            <Quote className="size-6" strokeWidth={1.7} />
          </span>
          <div
            aria-label={`${rating} out of 5 stars`}
            className="testimonial-stars flex gap-0.5 rounded-full border border-secondary/25 bg-secondary/[0.1] px-3 py-2 text-secondary"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                className={cn('size-4', index < rating ? 'fill-current' : 'opacity-25')}
                key={index}
                style={{ animationDelay: `${index * 55}ms` }}
              />
            ))}
          </div>
        </div>

        <blockquote className="line-clamp-7 text-[1.025rem] leading-[1.9] text-foreground/90 sm:text-[1.075rem] sm:leading-[1.95]">
          &ldquo;{testimonial.message}&rdquo;
        </blockquote>

        <div className="mt-auto flex items-center gap-4 border-t border-white/[0.1] pt-5 sm:pt-6">
          <div className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border border-primary/25 bg-white/[0.06] text-sm font-semibold text-primary shadow-[0_8px_24px_rgba(0,0,0,0.2)] sm:size-16">
            {imageUrl ? (
              <Image
                alt={image?.alt || testimonial.name || 'Testimonial author'}
                className="object-cover"
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
              <p className="mt-1 truncate text-sm text-muted-foreground">{testimonial.position}</p>
            ) : null}
            {testimonial.company ? (
              <p className="mt-0.5 truncate text-xs text-muted-foreground/70">{testimonial.company}</p>
            ) : null}
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
