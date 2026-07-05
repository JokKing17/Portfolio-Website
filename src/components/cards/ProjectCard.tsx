'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Github, Layers } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { getMedia, getMediaUrl, textArray } from '@/lib/utils'
import type { Project } from '@/types/project'

export function ProjectCard({ project }: { project: Project }) {
  const image = getMedia(project.coverImage)
  const imageUrl = getMediaUrl(project.coverImage)
  const tech = textArray(project.techStack).slice(0, 4)
  const href = project.slug ? `/projects/${project.slug}` : '#'

  return (
    <motion.article
      className="group gradient-border h-full rounded-lg"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.45 }}
    >
      <Link
        className="glass block h-full overflow-hidden rounded-lg"
        href={href}
        aria-disabled={!project.slug}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.04]">
          {imageUrl ? (
            <Image
              alt={image?.alt || project.title || 'Project cover'}
              className="object-cover transition duration-700 group-hover:scale-105"
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              src={imageUrl}
            />
          ) : (
            <div className="grid h-full place-items-center bg-aurora">
              <Layers className="size-10 text-primary/75" />
            </div>
          )}
          {project.featured ? (
            <Badge className="absolute left-4 top-4 border-primary/30 bg-primary/10 text-primary">
              Featured
            </Badge>
          ) : null}
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                {project.category || project.projectType || 'Project'}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{project.title}</h3>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
              {project.githubUrl ? <Github className="size-4" /> : null}
              {project.liveUrl ? <ExternalLink className="size-4" /> : null}
            </div>
          </div>
          {project.shortDescription ? (
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {project.shortDescription}
            </p>
          ) : null}
          {tech.length ? (
            <div className="flex flex-wrap gap-2">
              {tech.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </motion.article>
  )
}
