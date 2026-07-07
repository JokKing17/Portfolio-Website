import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Award, CalendarDays, CheckCircle2, Sparkles, Trophy } from 'lucide-react'
import { Reveal } from '@/components/animations/Reveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { achievementSlug, findAchievementBySlug, getRelatedProject } from '@/lib/achievements'
import { getCollection, getSiteSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { formatDate, getMedia, getMediaUrl } from '@/lib/utils'
import type { Achievement } from '@/types/payload-types'

export const revalidate = 60

type PageProps = {
  params: Promise<{ slug: string }>
}

async function getAchievement(slug: string) {
  const achievements = await getCollection<Achievement>('achievements', {
    depth: 3,
    limit: 1000,
    sort: 'order'
  })

  return findAchievementBySlug(achievements, slug)
}

export async function generateStaticParams() {
  const achievements = await getCollection<Achievement>('achievements', { depth: 0, limit: 1000 })
  return achievements.map((achievement) => ({ slug: achievementSlug(achievement) }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const [achievement, settings] = await Promise.all([getAchievement(slug), getSiteSettings()])

  return buildMetadata({
    description: achievement?.description,
    image: getMediaUrl(achievement?.image),
    path: `/achievements/${slug}`,
    settings,
    title: achievement?.title
  })
}

export default async function AchievementDetailPage({ params }: PageProps) {
  const { slug } = await params
  const achievement = await getAchievement(slug)
  if (!achievement) notFound()

  const image = getMedia(achievement.image)
  const imageUrl = getMediaUrl(achievement.image)
  const imageWidth = image?.width || 1600
  const imageHeight = image?.height || 1000
  const relatedProject = getRelatedProject(achievement)
  const paragraphs = achievement.description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <article className="pt-24">
      <header className="container pb-8">
        <Reveal>
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link className="transition hover:text-primary" href="/">
              Home
            </Link>
            <span>/</span>
            <Link className="transition hover:text-primary" href="/#achievements">
              Achievements
            </Link>
            <span>/</span>
            <span className="text-foreground">{achievement.title}</span>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            <Badge className="rounded-full border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Trophy className="mr-1.5 size-3.5" />
              Achievement
            </Badge>
            {achievement.date ? (
              <Badge className="rounded-full border-secondary/30 bg-secondary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                <CalendarDays className="mr-1.5 size-3.5" />
                {formatDate(achievement.date)}
              </Badge>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.55fr)] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-balance text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl lg:text-[4rem]">
                {achievement.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                {achievement.description}
              </p>
            </div>

            <div className="glass rounded-2xl p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <Sparkles className="size-4 text-primary" />
                  Recognition Date
                </p>
                <p className="text-sm font-medium text-foreground">
                  {achievement.date ? formatDate(achievement.date) : 'Date not specified'}
                </p>
              </div>
              {relatedProject ? (
                <div className="mt-3 rounded-xl border border-primary/20 bg-primary/[0.06] p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    <Award className="size-4" />
                    Related Project
                  </p>
                  <p className="text-sm font-medium leading-6 text-foreground">{relatedProject.title}</p>
                </div>
              ) : null}
            </div>
          </div>
        </Reveal>
      </header>

      <Reveal className="container pb-8" delay={0.08}>
        <div className="group overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] shadow-[0_30px_110px_rgba(0,0,0,0.38)] transition duration-500 hover:border-primary/30 hover:shadow-[0_34px_120px_rgba(0,214,201,0.12)]">
          {imageUrl ? (
            <Image
              alt={image?.alt || achievement.title || 'Achievement image'}
              className="mx-auto h-auto w-full object-contain transition duration-700 group-hover:scale-[1.01]"
              height={imageHeight}
              priority
              sizes="100vw"
              src={imageUrl}
              width={imageWidth}
            />
          ) : (
            <div className="grid aspect-[16/8] place-items-center bg-aurora">
              <Trophy className="size-14 text-secondary" />
            </div>
          )}
        </div>
      </Reveal>

      <section className="section-shell container grid gap-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
        <Reveal>
          <div className="glass rounded-2xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                <CheckCircle2 className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Achievement Details</h2>
                <p className="text-sm text-muted-foreground">Full recognition context</p>
              </div>
            </div>
            <div className="grid gap-4 text-[1.02rem] leading-8 text-muted-foreground">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Reveal>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <Reveal delay={0.05}>
            <div className="glass rounded-2xl p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl border border-secondary/25 bg-secondary/10 text-secondary">
                  <Trophy className="size-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">Recognition</h2>
                  <p className="text-sm text-muted-foreground">Award snapshot</p>
                </div>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <span className="text-muted-foreground">Title</span>
                  <span className="text-right font-medium text-foreground">{achievement.title}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-right font-medium text-foreground">
                    {achievement.date ? formatDate(achievement.date) : 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {relatedProject ? (
            <Reveal delay={0.1}>
              <div className="glass rounded-2xl p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Related Project
                </p>
                <h2 className="text-xl font-semibold leading-snug text-foreground">{relatedProject.title}</h2>
                {relatedProject.shortDescription ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
                    {relatedProject.shortDescription}
                  </p>
                ) : null}
                <Button asChild className="mt-5 w-full" variant="outline">
                  <Link href={`/projects/${relatedProject.slug}`}>
                    View Project
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.15}>
            <Button asChild className="w-full" variant="outline">
              <Link href="/#achievements">
                <ArrowLeft className="size-4" />
                Back to Achievements
              </Link>
            </Button>
          </Reveal>
        </aside>
      </section>
    </article>
  )
}
