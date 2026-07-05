'use client'

import Image from 'next/image'
import { Check, Gem } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getMedia, getMediaUrl, textArray } from '@/lib/utils'
import type { Service } from '@/types/payload-types'

export function ServicesSection({ heading, services }: { heading?: string; services: Service[] }) {
  return (
    <section className="section-shell container" id="services">
      <SectionHeading eyebrow="Services" title={heading || 'Services'} />
      {!services.length ? (
        <EmptyState title="No services published yet." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const icon = getMedia(service.icon)
            const iconUrl = getMediaUrl(service.icon)
            const features = textArray(service.features)

            return (
              <article
                className="glass rounded-lg p-6 transition duration-300 hover:border-primary/30 hover:shadow-glow"
                key={service.id}
              >
                <div className="mb-5 grid size-12 place-items-center rounded-md border border-white/12 bg-white/[0.04]">
                  {iconUrl ? (
                    <Image alt={icon?.alt || service.title || 'Service icon'} height={30} src={iconUrl} width={30} />
                  ) : (
                    <Gem className="size-6 text-primary" />
                  )}
                </div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
                {service.description ? (
                  <p className="mt-3 leading-7 text-muted-foreground">{service.description}</p>
                ) : null}
                {features.length ? (
                  <ul className="mt-5 grid gap-2">
                    {features.map((feature) => (
                      <li className="flex items-start gap-2 text-sm text-muted-foreground" key={feature}>
                        <Check className="mt-0.5 size-4 shrink-0 text-secondary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
