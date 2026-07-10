'use client'

import Image from 'next/image'
import { Check, Gem, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getMedia, getMediaUrl, textArray } from '@/lib/utils'
import type { Service } from '@/types/payload-types'

export function ServicesSection({ heading, services }: { heading?: string; services: Service[] }) {
  return (
    <section className="section-shell container" id="services">
      <SectionHeading
        eyebrow="Services"
        title={heading || 'Services'}
        description="Focused engineering support for AI products, backend systems, and polished web experiences."
      />
      {!services.length ? (
        <EmptyState title="No services published yet." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const icon = getMedia(service.icon)
            const iconUrl = getMediaUrl(service.icon)
            const features = textArray(service.features)

            return (
              <motion.article
                className="group h-full rounded-2xl bg-gradient-to-br from-primary/30 via-white/[0.1] to-secondary/20 p-px shadow-[0_18px_56px_rgba(0,0,0,0.28)] transition duration-300 hover:shadow-[0_24px_76px_rgba(0,214,201,0.12)]"
                initial={{ opacity: 0, y: 22 }}
                key={service.id}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                viewport={{ amount: 0.25, once: true }}
                whileHover={{ y: -5 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-[15px] border border-white/[0.14] bg-[rgba(13,18,27,0.95)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-md transition duration-300 group-hover:border-primary/35 group-hover:bg-[rgba(16,23,33,0.97)] sm:p-7">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="grid size-16 place-items-center rounded-2xl border border-primary/25 bg-primary/[0.11] text-primary shadow-[0_0_24px_rgba(0,214,201,0.1)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/45 group-hover:bg-primary/[0.15]">
                      {iconUrl ? (
                        <Image
                          alt={icon?.alt || service.title || 'Service icon'}
                          className="object-contain"
                          height={32}
                          src={iconUrl}
                          width={32}
                        />
                      ) : (
                        <Gem className="size-7" />
                      )}
                    </div>
                    <Badge className="rounded-full border-secondary/25 bg-secondary/[0.1] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary">
                      <Sparkles className="mr-1.5 size-3" />
                      Service
                    </Badge>
                  </div>

                  <h3 className="text-[1.4rem] font-semibold leading-snug text-foreground transition duration-300 group-hover:text-primary">
                    {service.title}
                  </h3>
                  {service.description ? (
                    <p className="mt-4 leading-7 text-muted-foreground">{service.description}</p>
                  ) : null}

                  {features.length ? (
                    <ul className="mt-auto grid gap-2.5 pt-6">
                      {features.map((feature) => (
                        <li
                          className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2.5 text-sm leading-6 text-muted-foreground transition duration-300 group-hover:border-white/[0.14]"
                          key={feature}
                        >
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-secondary/[0.14] text-secondary">
                            <Check className="size-3.5" />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </motion.article>
            )
          })}
        </div>
      )}
    </section>
  )
}
