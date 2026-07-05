'use client'

import Image from 'next/image'
import { Quote, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { getMedia, getMediaUrl } from '@/lib/utils'
import type { Testimonial } from '@/types/payload-types'

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const image = getMedia(testimonial.image)
  const imageUrl = getMediaUrl(testimonial.image)
  const rating = Math.min(Math.max(testimonial.rating || 5, 1), 5)

  return (
    <motion.article
      className="glass h-full rounded-lg p-6"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.42 }}
    >
      <Quote className="mb-5 size-7 text-primary" />
      <p className="leading-7 text-muted-foreground">{testimonial.message}</p>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative size-11 overflow-hidden rounded-md border border-white/12 bg-white/[0.04]">
            {imageUrl ? (
              <Image
                alt={image?.alt || testimonial.name || 'Testimonial author'}
                className="object-cover"
                fill
                sizes="44px"
                src={imageUrl}
              />
            ) : null}
          </div>
          <div>
            <p className="font-semibold text-foreground">{testimonial.name}</p>
            <p className="text-xs text-muted-foreground">
              {[testimonial.position, testimonial.company].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
        <div className="flex text-secondary">
          {Array.from({ length: rating }).map((_, index) => (
            <Star className="size-3.5 fill-current" key={index} />
          ))}
        </div>
      </div>
    </motion.article>
  )
}
