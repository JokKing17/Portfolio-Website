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
      className="group h-full rounded-2xl bg-gradient-to-br from-primary/30 via-white/[0.1] to-accent/20 p-px shadow-[0_18px_60px_rgba(0,0,0,0.3)] transition duration-300 hover:shadow-[0_28px_90px_rgba(0,214,201,0.15)]"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="relative flex h-full min-h-[430px] flex-col overflow-hidden rounded-[15px] border border-white/[0.14] bg-[rgba(13,18,27,0.9)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-md transition duration-300 group-hover:border-primary/40 group-hover:bg-[rgba(16,23,33,0.94)] sm:min-h-[460px] sm:p-8">
        <div className="mb-7 flex items-center justify-between gap-4">
          <span className="grid size-14 place-items-center rounded-2xl border border-primary/25 bg-primary/[0.12] text-primary shadow-[0_0_24px_rgba(0,214,201,0.12)] transition duration-300 group-hover:scale-105 group-hover:border-primary/45 group-hover:bg-primary/[0.16]">
            <Quote className="size-7" strokeWidth={1.7} />
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

        <blockquote className="line-clamp-[10] text-[1.05rem] leading-[1.95] text-foreground/90 sm:text-[1.1rem] sm:leading-[2.05]">
          &ldquo;{testimonial.message}&rdquo;
        </blockquote>

        <div className="mt-auto flex items-center gap-4 border-t border-white/[0.1] pt-6 sm:gap-5 sm:pt-7">
          <div className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border border-primary/30 bg-white/[0.06] text-sm font-semibold text-primary shadow-[0_0_24px_rgba(0,214,201,0.1),0_10px_30px_rgba(0,0,0,0.2)] sm:size-[68px]">
            {imageUrl ? (
              <Image
                alt={image?.alt || testimonial.name || 'Testimonial author'}
                className="object-cover"
                fill
                sizes="68px"
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
