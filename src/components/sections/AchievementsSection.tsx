'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Award, CalendarDays, Sparkles, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { achievementPath, getRelatedProject } from '@/lib/achievements'
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
      <SectionHeading
        eyebrow="Recognition"
        title={heading || 'Achievements'}
        description="Awards, milestones, and proof-of-work moments from shipped products and research."
      />
      {!achievements.length ? (
        <EmptyState title="No achievements published yet." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {achievements.map((achievement) => {
            const image = getMedia(achievement.image)
            const imageUrl = getMediaUrl(achievement.image)
            const relatedProject = getRelatedProject(achievement)

            return (
              <motion.article
                className="group h-full rounded-2xl bg-gradient-to-br from-primary/35 via-white/[0.12] to-secondary/25 p-px shadow-[0_18px_56px_rgba(0,0,0,0.3)] transition duration-300 hover:shadow-[0_26px_80px_rgba(0,214,201,0.13)]"
                initial={{ opacity: 0, y: 24 }}
                key={achievement.id}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                viewport={{ amount: 0.25, once: true }}
                whileHover={{ y: -5 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="relative flex h-full min-h-[540px] flex-col overflow-hidden rounded-[15px] border border-white/[0.14] bg-[rgba(13,18,27,0.95)] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_70px_rgba(0,0,0,0.26)] backdrop-blur-md transition duration-300 group-hover:border-primary/35 group-hover:bg-[rgba(16,23,33,0.97)]">
                  <Link
                    aria-label={`View ${achievement.title} achievement details`}
                    className="absolute inset-0 z-10"
                    href={achievementPath(achievement)}
                  />

                  <div className="relative m-3 mb-0 aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.12] bg-[radial-gradient(circle_at_top_left,rgba(0,214,201,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    {imageUrl ? (
                      <Image
                        alt={image?.alt || achievement.title || 'Achievement image'}
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                        fill
                        loading="lazy"
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        src={imageUrl}
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-aurora">
                        <Award className="size-10 text-secondary" />
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />
                    <Badge className="absolute left-4 top-4 rounded-full border-primary/35 bg-background/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary shadow-[0_0_26px_rgba(0,214,201,0.2)] backdrop-blur-md">
                      <Trophy className="mr-1.5 size-3" />
                      Achievement
                    </Badge>
                    <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full border border-white/15 bg-background/70 text-primary shadow-[0_0_24px_rgba(0,214,201,0.18)] backdrop-blur-md transition duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/45 group-hover:bg-primary/[0.12]">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5 pt-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                      {achievement.date ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.055] px-3 py-1.5">
                          <CalendarDays className="size-3.5 text-secondary" />
                          {formatDate(achievement.date)}
                        </span>
                      ) : null}
                      {relatedProject ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/[0.12] px-3 py-1.5 text-primary">
                          <Sparkles className="size-3.5" />
                          Related Project
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-4 line-clamp-2 min-h-[3.5rem] text-[1.35rem] font-semibold leading-[1.22] text-foreground transition duration-300 group-hover:text-primary sm:text-[1.45rem]">
                      {achievement.title}
                    </h3>

                    {achievement.description ? (
                      <p className="mt-4 line-clamp-3 min-h-[5.25rem] text-sm leading-7 text-muted-foreground">
                        {achievement.description}
                      </p>
                    ) : null}

                    {relatedProject ? (
                      <Link
                        className="relative z-20 mt-5 rounded-xl border border-white/[0.12] bg-white/[0.055] p-3 transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/[0.12]"
                        href={`/projects/${relatedProject.slug}`}
                      >
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                          Related Project
                        </p>
                        <p className="line-clamp-2 text-sm font-medium text-foreground">
                          {relatedProject.title}
                        </p>
                      </Link>
                    ) : null}

                    <div className="mt-auto pt-6">
                      <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/28 bg-primary/[0.1] px-4 py-2.5 text-sm font-semibold text-primary transition duration-300 group-hover:border-primary/45 group-hover:bg-primary/[0.15] group-hover:shadow-[0_10px_28px_rgba(0,0,0,0.2)]">
                        View Details
                        <ArrowUpRight className="size-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}
    </section>
  )
}
