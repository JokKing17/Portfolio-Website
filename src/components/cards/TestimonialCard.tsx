'use client'

import Image from 'next/image'
import { Quote, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn, getMedia, getMediaUrl } from '@/lib/utils'
import type { Testimonial } from '@/types/payload-types'

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const image = getMedia(testimonial.image)
  const imageUrl = getMediaUrl(testimonial.image)
  const rating = Math.min(Math.max(testimonial.rating || 5, 1), 5)
  const role = [testimonial.position, testimonial.company].filter(Boolean).join(', ')

  return (
    <motion.article
      className="group h-full rounded-2xl bg-gradient-to-br from-primary/30 via-white/[0.1] to-accent/20 p-px shadow-[0_18px_60px_rgba(0,0,0,0.3)] transition duration-300 hover:shadow-[0_26px_90px_rgba(0,214,201,0.14)]"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[15px] border border-white/[0.14] bg-[rgba(13,18,27,0.9)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-md transition duration-300 group-hover:border-primary/35 group-hover:bg-[rgba(16,23,33,0.94)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-2xl border border-primary/25 bg-primary/[0.12] text-primary shadow-[0_0_24px_rgba(0,214,201,0.12)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/45 group-hover:bg-primary/[0.16]">
            <Quote className="size-5" />
          </span>
          <div className="flex rounded-full border border-secondary/25 bg-secondary/[0.1] px-3 py-1.5 text-secondary">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                className={cn('size-3.5', index < rating ? 'fill-current' : 'opacity-25')}
                key={index}
              />
            ))}
          </div>
        </div>

        <p className="text-[0.98rem] leading-8 text-muted-foreground">
          <span aria-hidden="true">&ldquo;</span>
          {testimonial.message}
          <span aria-hidden="true">&rdquo;</span>
        </p>

        <div className="mt-auto flex items-center gap-4 pt-7">
          <div className="relative grid size-[52px] shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/[0.14] bg-white/[0.06] text-sm font-semibold text-primary shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            {imageUrl ? (
              <Image
                alt={image?.alt || testimonial.name || 'Testimonial author'}
                className="object-cover"
                fill
                sizes="52px"
                src={imageUrl}
              />
            ) : (
              getInitials(testimonial.name)
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold leading-6 text-foreground">{testimonial.name}</p>
            {role ? <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{role}</p> : null}
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
