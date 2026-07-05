'use client'

import { GraduationCap } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { formatDate } from '@/lib/utils'
import type { Education } from '@/types/payload-types'

export function EducationSection({ education, heading }: { education: Education[]; heading?: string }) {
  return (
    <section className="section-shell container" id="education">
      <SectionHeading eyebrow="Foundation" title={heading || 'Education'} />
      {!education.length ? (
        <EmptyState title="No education entries published yet." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {education.map((item) => (
            <article className="glass rounded-lg p-6" key={item.id}>
              <GraduationCap className="mb-5 size-7 text-secondary" />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{item.degree}</h3>
                  <p className="text-muted-foreground">
                    {[item.institute, item.location].filter(Boolean).join(' - ')}
                  </p>
                </div>
                <p className="text-sm text-secondary">
                  {formatDate(item.startDate)} - {formatDate(item.endDate)}
                </p>
              </div>
              {item.grade ? <p className="mt-4 text-sm text-primary">{item.grade}</p> : null}
              {item.description ? (
                <p className="mt-4 leading-7 text-muted-foreground">{item.description}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
