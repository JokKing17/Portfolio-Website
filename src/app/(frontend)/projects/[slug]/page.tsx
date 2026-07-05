import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink, Github } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { findBySlug, getProjectSlugs, getSiteSettings } from '@/lib/payload'
import { projectMetadata } from '@/lib/seo'
import { formatDate, getMedia, getMediaUrl, textArray } from '@/lib/utils'
import type { Project } from '@/types/project'

export const revalidate = 60

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const [project, settings] = await Promise.all([
    findBySlug<Project>('projects', slug),
    getSiteSettings()
  ])

  return projectMetadata(project, settings)
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await findBySlug<Project>('projects', slug)
  if (!project) notFound()

  const cover = getMedia(project.coverImage)
  const coverUrl = getMediaUrl(project.coverImage)
  const tech = textArray(project.techStack)
  const metrics = textArray(project.metrics)
  const gallery = (project.galleryImages || []).map((image) => ({
    asset: getMedia(image),
    url: getMediaUrl(image)
  }))

  return (
    <article className="pt-28">
      <header className="container pb-12">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          {project.category || project.projectType || 'Project'}
        </p>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h1 className="text-balance text-4xl font-semibold sm:text-6xl">{project.title}</h1>
            {project.shortDescription ? (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                {project.shortDescription}
              </p>
            ) : null}
          </div>
          <div className="glass rounded-lg p-5">
            <p className="text-sm text-muted-foreground">
              {formatDate(project.startDate)}
              {project.endDate ? ` - ${formatDate(project.endDate)}` : ''}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.githubUrl ? (
                <Button asChild variant="outline">
                  <Link href={project.githubUrl} rel="noreferrer" target="_blank">
                    <Github className="size-4" />
                    GitHub
                  </Link>
                </Button>
              ) : null}
              {project.liveUrl ? (
                <Button asChild>
                  <Link href={project.liveUrl} rel="noreferrer" target="_blank">
                    Live
                    <ExternalLink className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </header>
      <div className="container">
        <div className="relative aspect-[16/8] overflow-hidden rounded-lg border border-white/12 bg-white/[0.04]">
          {coverUrl ? (
            <Image
              alt={cover?.alt || project.title || 'Project cover'}
              className="object-cover"
              fill
              priority
              sizes="100vw"
              src={coverUrl}
            />
          ) : (
            <div className="h-full bg-aurora" />
          )}
        </div>
      </div>
      <section className="section-shell container grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="space-y-5">
          {tech.length ? (
            <div className="glass rounded-lg p-5">
              <h2 className="mb-4 text-lg font-semibold">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {tech.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
          ) : null}
          {metrics.length ? (
            <div className="glass rounded-lg p-5">
              <h2 className="mb-4 text-lg font-semibold">Results</h2>
              <ul className="grid gap-3 text-sm text-muted-foreground">
                {metrics.map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
        <div className="glass rounded-lg p-6 sm:p-8">
          {project.fullDescription ? (
            <p className="text-lg leading-8 text-muted-foreground">{project.fullDescription}</p>
          ) : null}
          {[
            ['Challenge', project.challenges],
            ['Solution', project.solution],
            ['Outcome', project.results]
          ].map(([title, body]) =>
            body ? (
              <section className="mt-8" key={title}>
                <h2 className="text-2xl font-semibold">{title}</h2>
                <p className="mt-3 leading-8 text-muted-foreground">{body}</p>
              </section>
            ) : null
          )}
        </div>
      </section>
      {gallery.some((item) => item.url) ? (
        <section className="container pb-24">
          <div className="grid gap-5 md:grid-cols-2">
            {gallery.map((item, index) =>
              item.url ? (
                <div
                  className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/12 bg-white/[0.04]"
                  key={`${item.url}-${index}`}
                >
                  <Image
                    alt={item.asset?.alt || project.title || 'Project gallery'}
                    className="object-cover"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    src={item.url}
                  />
                </div>
              ) : null
            )}
          </div>
        </section>
      ) : null}
    </article>
  )
}
