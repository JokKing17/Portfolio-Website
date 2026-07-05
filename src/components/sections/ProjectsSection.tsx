'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProjectCard } from '@/components/cards/ProjectCard'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Project } from '@/types/project'

type ProjectsSectionProps = {
  heading?: string
  projects: Project[]
  featuredOnly?: boolean
  limit?: number
  showArchiveLink?: boolean
}

export function ProjectsSection({
  featuredOnly,
  heading,
  limit,
  projects,
  showArchiveLink = true
}: ProjectsSectionProps) {
  const filtered = featuredOnly ? projects.filter((project) => project.featured) : projects
  const visibleProjects = typeof limit === 'number' ? filtered.slice(0, limit) : filtered

  return (
    <section className="section-shell container" id={featuredOnly ? 'featured-projects' : 'projects'}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow={featuredOnly ? 'Selected Work' : 'Archive'}
          title={heading || (featuredOnly ? 'Featured Projects' : 'Projects')}
          description={
            featuredOnly
              ? 'Selected work with measurable decisions, craft, and outcomes.'
              : 'A broader look at shipped systems, experiments, and client work.'
          }
        />
        {showArchiveLink ? (
          <Button asChild className="mb-10 self-start" variant="outline">
            <Link href="/projects">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : null}
      </div>
      {!visibleProjects.length ? (
        <EmptyState title="No projects published yet." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}
