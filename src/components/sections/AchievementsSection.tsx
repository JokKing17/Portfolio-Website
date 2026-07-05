'use client'

import Image from 'next/image'
import { Award } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { formatDate, getMedia, getMediaUrl } from '@/lib/utils'
import type { Achievement } from '@/types/payload-types'

export function AchievementsSection({
  achievements,
  heading
}: {
  achievements: Achievement[]
  heading?: string
}) {
  return (
    <section className="section-shell container" id="achievements">
      <SectionHeading eyebrow="Recognition" title={heading || 'Achievements'} />
      {!achievements.length ? (
        <EmptyState title="No achievements published yet." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {achievements.map((achievement) => {
            const image = getMedia(achievement.image)
            const imageUrl = getMediaUrl(achievement.image)

            return (
              <article className="glass overflow-hidden rounded-lg" key={achievement.id}>
                <div className="relative aspect-[16/10] bg-white/[0.04]">
                  {imageUrl ? (
                    <Image
                      alt={image?.alt || achievement.title || 'Achievement image'}
                      className="object-cover"
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      src={imageUrl}
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-aurora">
                      <Award className="size-10 text-secondary" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {achievement.date ? (
                    <p className="mb-2 text-sm text-secondary">{formatDate(achievement.date)}</p>
                  ) : null}
                  <h3 className="text-xl font-semibold">{achievement.title}</h3>
                  {achievement.description ? (
                    <p className="mt-3 leading-7 text-muted-foreground">{achievement.description}</p>
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
