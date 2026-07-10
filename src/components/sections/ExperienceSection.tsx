'use client'

import Image from 'next/image'
import { BriefcaseBusiness } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { formatDate, getMedia, getMediaUrl, textArray } from '@/lib/utils'
import type { Experience } from '@/types/payload-types'

export function ExperienceSection({
  experience,
  heading
}: {
  experience: Experience[]
  heading?: string
}) {
  return (
    <section className="section-shell container" id="experience">
      <SectionHeading eyebrow="Trajectory" title={heading || 'Experience'} />
      {!experience.length ? (
        <EmptyState title="No experience entries published yet." />
      ) : (
        <div className="relative space-y-6 before:absolute before:left-5 before:top-0 before:h-full before:w-px before:bg-white/12">
          {experience.map((item) => {
            const logo = getMedia(item.companyLogo)
            const logoUrl = getMediaUrl(item.companyLogo)
            const technologies = textArray(item.technologies)

            return (
              <article className="relative pl-14" key={item.id}>
                <div className="absolute left-0 top-3 grid size-10 place-items-center rounded-xl border border-primary/30 bg-background text-primary shadow-[0_0_24px_rgba(0,214,201,0.12)]">
                  {logoUrl ? (
                    <Image alt={logo?.alt || item.company || 'Company logo'} height={28} src={logoUrl} width={28} />
                  ) : (
                    <BriefcaseBusiness className="size-5" />
                  )}
                </div>
                <div className="polished-card rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7">
                  <div>
                    <h3 className="text-xl font-semibold leading-tight text-foreground">{item.position}</h3>
                    <p className="mt-2 font-medium text-muted-foreground">
                        {[item.company, item.location].filter(Boolean).join(' - ')}
                    </p>
                    <p className="mt-2 text-sm font-medium text-secondary">
                      {formatDate(item.startDate)} - {item.currentlyWorking ? 'Present' : formatDate(item.endDate)}
                    </p>
                  </div>
                  {item.description ? (
                    <p className="mt-5 leading-7 text-muted-foreground">{item.description}</p>
                  ) : null}
                  {textArray(item.responsibilities).length ? (
                    <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
                      {textArray(item.responsibilities).map((responsibility) => (
                        <li className="flex gap-2" key={responsibility}>
                          <span className="mt-2 size-1.5 rounded-full bg-primary" />
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {technologies.length ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {technologies.map((technology) => (
                        <Badge key={technology}>{technology}</Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
