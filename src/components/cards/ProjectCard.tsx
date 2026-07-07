'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, CalendarDays, ExternalLink, Github, Layers, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { getMedia, getMediaUrl, textArray } from '@/lib/utils'
import type { Project } from '@/types/project'

export function ProjectCard({ project }: { project: Project }) {
  const image = getMedia(project.coverImage)
  const imageUrl = getMediaUrl(project.coverImage)
  const techStack = textArray(project.techStack)
  const visibleTech = techStack.slice(0, 5)
  const hiddenTechCount = Math.max(techStack.length - visibleTech.length, 0)
  const href = project.slug ? `/projects/${project.slug}` : '#'
  const category = project.category || project.projectType || 'Project'
  const projectYear = getProjectYear(project.endDate || project.startDate)
  const projectType =
    project.projectType && project.projectType.toLowerCase() !== category.toLowerCase()
      ? project.projectType
      : null

  return (
    <motion.article
      className="group h-full rounded-2xl bg-gradient-to-br from-primary/45 via-white/10 to-accent/35 p-px shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:shadow-[0_26px_90px_rgba(0,214,201,0.14)]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="glass relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-[15px] border-white/10 bg-card/80 transition duration-300 group-hover:border-primary/35 group-hover:bg-white/[0.055]">
        {project.slug ? (
          <Link
            aria-label={`View ${project.title || 'project'} case study`}
            className="absolute inset-0 z-10"
            href={href}
          />
        ) : null}

        <div className="relative m-3 mb-0 aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,214,201,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          {imageUrl ? (
            <Image
              alt={image?.alt || project.title || 'Project cover'}
              className="object-contain p-1 transition duration-700 group-hover:scale-[1.035]"
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              src={imageUrl}
            />
          ) : (
            <div className="grid h-full place-items-center bg-aurora">
              <Layers className="size-10 text-primary/75" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          {project.featured ? (
            <Badge className="absolute left-4 top-4 border-primary/35 bg-primary/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary shadow-[0_0_26px_rgba(0,214,201,0.22)] backdrop-blur-md">
              <Sparkles className="mr-1.5 size-3" />
              Featured
            </Badge>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-5 pt-6 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Badge className="rounded-full border-secondary/30 bg-secondary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary shadow-[0_0_20px_rgba(255,183,77,0.12)]">
                {category}
              </Badge>
              <h3 className="mt-4 line-clamp-2 min-h-[3.5rem] text-[1.35rem] font-semibold leading-[1.22] text-foreground transition duration-300 group-hover:text-primary sm:text-[1.45rem]">
                {project.title}
              </h3>
            </div>
            <div className="relative z-20 flex shrink-0 items-center gap-2">
              {project.githubUrl ? (
                <a
                  aria-label={`${project.title || 'Project'} GitHub repository`}
                  className="grid size-9 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-muted-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                  href={project.githubUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Github className="size-4" />
                </a>
              ) : null}
              {project.liveUrl ? (
                <a
                  aria-label={`${project.title || 'Project'} live demo`}
                  className="grid size-9 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-muted-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                  href={project.liveUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink className="size-4" />
                </a>
              ) : null}
            </div>
          </div>

          {projectYear || projectType ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
              {projectYear ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">
                  <CalendarDays className="size-3.5 text-primary" />
                  {projectYear}
                </span>
              ) : null}
              {projectType ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">
                  <ArrowUpRight className="size-3.5 text-primary" />
                  {projectType}
                </span>
              ) : null}
            </div>
          ) : null}

          {project.shortDescription ? (
            <p className="mt-5 line-clamp-3 min-h-[4.75rem] text-sm leading-7 text-muted-foreground/95">
              {project.shortDescription}
            </p>
          ) : null}

          {visibleTech.length ? (
            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              {visibleTech.map((item) => (
                <Badge
                  className="relative z-20 rounded-full border-white/12 bg-white/[0.045] px-3 py-1.5 text-[11px] text-muted-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/10 hover:text-primary"
                  key={item}
                >
                  {item}
                </Badge>
              ))}
              {hiddenTechCount ? (
                <Badge className="rounded-full border-primary/25 bg-primary/10 px-3 py-1.5 text-[11px] text-primary">
                  +{hiddenTechCount} more
                </Badge>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}

function getProjectYear(value?: string | null) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.getFullYear().toString()
}
