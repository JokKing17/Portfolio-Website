import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Github,
  Layers3,
  Sparkles,
  Target,
  Trophy,
  Wrench,
  type LucideIcon
} from 'lucide-react'
import { Reveal } from '@/components/animations/Reveal'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
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

type ParsedCopy =
  | {
      items: string[]
      type: 'list'
    }
  | {
      items: string[]
      type: 'paragraphs'
    }

const techCategoryOrder = ['AI / ML', 'Frontend', 'Backend & Data', 'Cloud & DevOps', 'Mobile', 'Languages', 'Tools']

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

function uniqueValues(values: Array<string | false | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))))
}

function dateRange(project: Project) {
  const start = formatDate(project.startDate)
  const end = formatDate(project.endDate)

  if (start && end) return `${start} - ${end}`
  if (start) return start
  if (end) return end
  return 'Timeline not specified'
}

function inferTechCategory(technology: string) {
  const value = technology.toLowerCase()

  if (
    value.includes('ai') ||
    value.includes('llm') ||
    value.includes('langchain') ||
    value.includes('langgraph') ||
    value.includes('rag') ||
    value.includes('vision') ||
    value.includes('machine learning') ||
    value.includes('openai')
  ) {
    return 'AI / ML'
  }

  if (value.includes('react') || value.includes('next') || value.includes('tailwind') || value.includes('frontend')) {
    return 'Frontend'
  }

  if (
    value.includes('api') ||
    value.includes('fastapi') ||
    value.includes('node') ||
    value.includes('payload') ||
    value.includes('mongo') ||
    value.includes('sql') ||
    value.includes('firebase') ||
    value.includes('database')
  ) {
    return 'Backend & Data'
  }

  if (
    value.includes('docker') ||
    value.includes('vercel') ||
    value.includes('cloudflare') ||
    value.includes('aws') ||
    value.includes('devops')
  ) {
    return 'Cloud & DevOps'
  }

  if (value.includes('flutter') || value.includes('dart') || value.includes('mobile')) return 'Mobile'
  if (['python', 'typescript', 'javascript', 'c++', 'c#', 'java'].includes(value)) return 'Languages'

  return 'Tools'
}

function groupTechStack(tech: string[]) {
  const groups = tech.reduce<Record<string, string[]>>((acc, technology) => {
    const category = inferTechCategory(technology)
    acc[category] = [...(acc[category] || []), technology]
    return acc
  }, {})

  return techCategoryOrder
    .map((category) => ({
      category,
      items: groups[category] || []
    }))
    .filter((group) => group.items.length)
}

function stripBulletMarker(value: string) {
  return value.replace(/^\s*(?:[-*•✓✔]|\d+[.)])\s+/, '').trim()
}

function parseCopy(value?: string | null, preferCards = false): ParsedCopy | null {
  const trimmed = value?.trim()
  if (!trimmed) return null

  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const hasLineBullets = lines.some((line) => /^\s*(?:[-*•✓✔]|\d+[.)])\s+/.test(line))
  if (hasLineBullets || lines.length > 1) {
    return {
      items: lines.map(stripBulletMarker).filter(Boolean),
      type: 'list'
    }
  }

  if (preferCards) {
    const sentenceItems = trimmed
      .match(/[^.!?]+[.!?]?/g)
      ?.map((item) => item.trim())
      .filter((item) => item.length > 8)

    if (sentenceItems && sentenceItems.length > 1 && sentenceItems.length <= 6) {
      return {
        items: sentenceItems,
        type: 'list'
      }
    }
  }

  return {
    items: trimmed.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean),
    type: 'paragraphs'
  }
}

function TechStackCard({ tech }: { tech: string[] }) {
  if (!tech.length) return null

  const groups = groupTechStack(tech)

  return (
    <div className="glass rounded-2xl p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
          <Layers3 className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Tech Stack</h2>
          <p className="text-sm text-muted-foreground">{tech.length} technologies used</p>
        </div>
      </div>
      <div className="grid gap-5">
        {groups.map((group) => (
          <div key={group.category}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Badge
                  className="rounded-full border-white/12 bg-white/[0.045] px-3 py-1.5 text-[0.8rem] transition duration-300 hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                  key={item}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CopyBlock({
  body,
  icon: Icon,
  preferCards,
  title
}: {
  body?: string | null
  icon: LucideIcon
  preferCards?: boolean
  title: string
}) {
  const copy = parseCopy(body, preferCards)
  if (!copy) return null

  return (
    <section className="rounded-2xl border border-white/12 bg-white/[0.035] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.2)] transition duration-300 hover:border-primary/25 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
      </div>

      {copy.type === 'list' ? (
        <div className={preferCards ? 'grid gap-3 sm:grid-cols-2' : 'grid gap-3'}>
          {copy.items.map((item) => (
            <div
              className="flex gap-3 rounded-xl border border-white/10 bg-background/35 p-4 text-muted-foreground transition duration-300 hover:border-primary/25 hover:bg-primary/[0.055]"
              key={item}
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="leading-7">{item}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 text-[1.02rem] leading-8 text-muted-foreground">
          {copy.items.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
    </section>
  )
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await findBySlug<Project>('projects', slug)
  if (!project) notFound()

  const cover = getMedia(project.coverImage)
  const coverUrl = getMediaUrl(project.coverImage)
  const tech = textArray(project.techStack)
  const metrics = textArray(project.metrics)
  const gallery = (project.galleryImages || [])
    .map((image) => {
      const asset = getMedia(image)
      const url = getMediaUrl(image)

      return url
        ? {
            alt: asset?.alt || project.title || 'Project gallery',
            url
          }
        : null
    })
    .filter((item): item is { alt: string; url: string } => Boolean(item))

  const heroTags = uniqueValues([
    project.category,
    project.projectType,
    project.featured ? 'Featured' : null
  ])

  return (
    <article className="pt-20">
      <header className="container pb-6 pt-5 sm:pt-8">
        <Reveal>
          <div className="mb-5 flex flex-wrap gap-2">
            {heroTags.length ? (
              heroTags.map((tag) => (
                <span
                  className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
                  key={tag}
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Project
              </span>
            )}
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.62fr)] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-balance text-3xl font-semibold leading-[1.04] text-foreground sm:text-5xl lg:text-[3.25rem]">
                {project.title}
              </h1>
              {project.shortDescription ? (
                <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {project.shortDescription}
                </p>
              ) : null}
            </div>
            <div className="glass rounded-2xl p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <CalendarDays className="size-4 text-primary" />
                    Timeline
                  </p>
                  <p className="text-sm font-medium text-foreground">{dateRange(project)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <Sparkles className="size-4 text-primary" />
                    Type
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {project.projectType || project.category || 'Portfolio project'}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.githubUrl ? (
                  <Button asChild className="flex-1 px-4" size="sm" variant="outline">
                    <Link href={project.githubUrl} rel="noreferrer" target="_blank">
                      <Github className="size-4" />
                      GitHub
                    </Link>
                  </Button>
                ) : null}
                {project.liveUrl ? (
                  <Button asChild className="flex-1 px-4" size="sm">
                    <Link href={project.liveUrl} rel="noreferrer" target="_blank">
                      Live Demo
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </header>

      <Reveal className="container pb-8" delay={0.08}>
        <div className="group relative aspect-[16/8] overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] shadow-[0_30px_110px_rgba(0,0,0,0.38)] transition duration-500 hover:border-primary/30 hover:shadow-[0_34px_120px_rgba(0,214,201,0.12)] sm:aspect-[16/7]">
          {coverUrl ? (
            <Image
              alt={cover?.alt || project.title || 'Project cover'}
              className="object-cover transition duration-700 group-hover:scale-[1.025]"
              fill
              priority
              sizes="100vw"
              src={coverUrl}
            />
          ) : (
            <div className="h-full bg-aurora" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/22 via-transparent to-transparent opacity-70" />
        </div>
      </Reveal>

      <section className="section-shell container grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <aside className="space-y-5 lg:sticky lg:top-24">
          <Reveal>
            <div className="glass rounded-2xl p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <ArrowUpRight className="size-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">Project Snapshot</h2>
                  <p className="text-sm text-muted-foreground">Key links and context</p>
                </div>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <span className="text-muted-foreground">Category</span>
                  <span className="text-right font-medium text-foreground">
                    {project.category || project.projectType || 'Project'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <span className="text-muted-foreground">Timeline</span>
                  <span className="text-right font-medium text-foreground">{dateRange(project)}</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <TechStackCard tech={tech} />
          </Reveal>

          {metrics.length ? (
            <Reveal delay={0.1}>
              <div className="glass rounded-2xl p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                    <Trophy className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold">Results</h2>
                    <p className="text-sm text-muted-foreground">Measured project impact</p>
                  </div>
                </div>
                <ul className="grid gap-3 text-sm text-muted-foreground">
                  {metrics.map((metric) => (
                    <li
                      className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition duration-300 hover:border-primary/25 hover:text-foreground"
                      key={metric}
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ) : null}
        </aside>

        <Reveal delay={0.08}>
          <div className="grid gap-5">
            {project.fullDescription ? (
              <section className="glass rounded-2xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-7">
                <p className="max-w-4xl text-lg leading-9 text-muted-foreground">{project.fullDescription}</p>
              </section>
            ) : null}
            <CopyBlock body={project.challenges} icon={Target} title="Challenge" />
            <CopyBlock body={project.solution} icon={Wrench} title="Solution" />
            <CopyBlock body={project.results} icon={Trophy} preferCards title="Outcome" />
          </div>
        </Reveal>
      </section>

      <ProjectGallery images={gallery} title={project.title || 'Project gallery'} />
    </article>
  )
}
