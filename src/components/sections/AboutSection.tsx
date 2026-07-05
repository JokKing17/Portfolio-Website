'use client'

import Image from 'next/image'
import { MapPin, Sparkle } from 'lucide-react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getMedia, getMediaUrl, textArray } from '@/lib/utils'
import type { About } from '@/types/payload-types'

function Counter({ label, value }: { label: string; value?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { damping: 22, stiffness: 90 })
  const rounded = useTransform(spring, (latest) => Math.round(latest).toString())

  useEffect(() => {
    if (inView) motionValue.set(value || 0)
  }, [inView, motionValue, value])

  return (
    <div className="rounded-lg border border-white/12 bg-white/[0.04] p-5" ref={ref}>
      <motion.p className="text-3xl font-semibold text-primary">{rounded}</motion.p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export function AboutSection({ about, heading }: { about?: About | null; heading?: string }) {
  const image = getMedia(about?.profileImage)
  const imageUrl = getMediaUrl(about?.profileImage)
  const highlights = textArray(about?.highlights)

  if (!about) {
    return (
      <section className="section-shell container" id="about">
        <EmptyState title="About content is not published yet." />
      </section>
    )
  }

  return (
    <section className="section-shell container" id="about">
      <SectionHeading eyebrow="Profile" title={heading || about.title || 'About'} />
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/12 bg-white/[0.04]">
          {imageUrl ? (
            <Image
              alt={image?.alt || about.title || 'Profile image'}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              src={imageUrl}
            />
          ) : (
            <div className="h-full bg-aurora" />
          )}
        </div>
        <div className="glass rounded-lg p-6 sm:p-8">
          {about.location ? (
            <p className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-3 py-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              {about.location}
            </p>
          ) : null}
          {about.description ? (
            <p className="text-lg leading-8 text-muted-foreground">{about.description}</p>
          ) : null}
          {highlights.length ? (
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div className="flex gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4" key={item}>
                  <Sparkle className="mt-0.5 size-4 shrink-0 text-secondary" />
                  <span className="text-sm leading-6 text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          ) : null}
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <Counter label="Years" value={about.yearsOfExperience || undefined} />
            <Counter label="Projects" value={about.totalProjects || undefined} />
            <Counter label="Clients" value={about.totalClients || undefined} />
          </div>
        </div>
      </div>
    </section>
  )
}
