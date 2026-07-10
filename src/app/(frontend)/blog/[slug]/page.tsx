import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, FolderOpen, Mail, Sparkles } from 'lucide-react'
import { Reveal } from '@/components/animations/Reveal'
import { ArticleSectionNav, ReadingProgress, ShareButtons } from '@/components/blog/ArticleTools'
import { BlogCard } from '@/components/cards/BlogCard'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { RichText } from '@/components/ui/RichText'
import { Button } from '@/components/ui/button'
import { findBySlug, getBlogSlugs, getCollection, getContactInfo, getSingleton, getSiteSettings } from '@/lib/payload'
import { getArticleHeadings, getReadingTime } from '@/lib/blog'
import { blogMetadata } from '@/lib/seo'
import { formatDate, getMedia, getMediaUrl, textArray } from '@/lib/utils'
import type { About, Blog } from '@/types/payload-types'

export const revalidate = 60
type PageProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const [blog, settings] = await Promise.all([findBySlug<Blog>('blogs', slug), getSiteSettings()])
  return blogMetadata(blog, settings)
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [blog, allBlogs, about, contact, settings] = await Promise.all([
    findBySlug<Blog>('blogs', slug),
    getCollection<Blog>('blogs', { sort: '-publishedDate', limit: 200 }),
    getSingleton<About>('about'),
    getContactInfo(),
    getSiteSettings()
  ])
  if (!blog) notFound()

  const cover = getMedia(blog.coverImage)
  const coverUrl = getMediaUrl(blog.coverImage)
  const profile = getMedia(about?.profileImage)
  const profileUrl = getMediaUrl(about?.profileImage)
  const tags = textArray(blog.tags)
  const headings = getArticleHeadings(blog.content)
  const readingTime = getReadingTime(blog.content)
  const currentIndex = allBlogs.findIndex((item) => item.id === blog.id)
  const previous = currentIndex >= 0 ? allBlogs[currentIndex + 1] : null
  const next = currentIndex > 0 ? allBlogs[currentIndex - 1] : null
  const related = allBlogs.filter((item) => item.id !== blog.id && textArray(item.tags).some((tag) => tags.includes(tag))).slice(0, 3)
  const fallbacks = allBlogs.filter((item) => item.id !== blog.id && !related.some((relatedBlog) => relatedBlog.id === item.id))
  const suggestions = [...related, ...fallbacks].slice(0, 3)

  return (
    <article className="pb-20 pt-20">
      <ReadingProgress />
      <header className="container pb-10 pt-7 sm:pt-11">
        <Reveal>
          <div className="mb-9 flex items-center justify-between gap-4">
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:-translate-x-0.5 hover:text-primary" href="/blog"><ArrowLeft className="size-4" />Back to Blogs</Link>
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="max-w-5xl">
              <div className="mb-6 flex flex-wrap items-center gap-2.5">
                {blog.featured ? <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-primary"><Sparkles className="size-3.5" />Featured</span> : null}
                {tags.slice(0, 4).map((tag) => <span className="rounded-full border border-white/12 bg-white/[.055] px-3 py-1.5 text-xs text-muted-foreground" key={tag}>{tag}</span>)}
              </div>
              <h1 className="text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">{blog.title}</h1>
              {blog.excerpt ? <p className="mt-7 max-w-[72ch] text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">{blog.excerpt}</p> : null}
              <div className="mt-8 flex flex-wrap gap-5 text-sm font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-2"><CalendarDays className="size-4 text-primary" />{formatDate(blog.publishedDate)}</span>
                <span className="inline-flex items-center gap-2"><Clock3 className="size-4 text-primary" />{readingTime} min read</span>
              </div>
            </div>
            <div className="w-fit rounded-2xl border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,.065),rgba(255,255,255,.025))] p-4 shadow-[0_18px_55px_rgba(0,0,0,.22)] backdrop-blur-xl lg:mt-1">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">Share article</p>
              <ShareButtons compact title={blog.title} />
            </div>
          </div>
        </Reveal>
      </header>

      <Reveal className="container pb-12" delay={0.06}>
        <div className="group overflow-hidden rounded-2xl border border-white/12 bg-white/[.04] shadow-[0_30px_110px_rgba(0,0,0,.4)]">
          {coverUrl ? <Image alt={cover?.alt || blog.title} className="h-auto max-h-[760px] w-full object-contain transition duration-700 group-hover:scale-[1.008]" height={cover?.height || 900} priority sizes="100vw" src={coverUrl} width={cover?.width || 1600} /> : <div className="aspect-[16/8] bg-aurora" />}
        </div>
      </Reveal>

      <section className="container mb-10"><div className="glass flex flex-col justify-between gap-5 rounded-2xl p-5 sm:flex-row sm:items-center sm:p-6"><div><p className="font-semibold text-foreground">Worth sharing?</p><p className="mt-1 text-sm text-muted-foreground">Pass this article along to someone who might find it useful.</p></div><ShareButtons title={blog.title} /></div></section>

      <ArticleSectionNav headings={headings} />

      <section className="container min-w-0 pt-8 sm:pt-10" id="article-body">
        <div className="mx-auto min-w-0 max-w-[920px] rounded-2xl border border-white/10 bg-[rgba(13,18,27,.62)] px-5 py-4 shadow-[0_30px_100px_rgba(0,0,0,.2)] sm:px-9 sm:py-7 lg:px-12 xl:px-14"><RichText content={blog.content} headings={headings} /></div>
      </section>

      <section className="container mt-14 max-w-4xl">
        <Reveal><div className="glass flex flex-col gap-6 rounded-2xl p-6 sm:flex-row sm:items-center sm:p-8">{profileUrl ? <Image alt={profile?.alt || about?.title || 'Author'} className="size-24 shrink-0 rounded-2xl border border-primary/25 object-cover shadow-glow" height={96} src={profileUrl} width={96} /> : <div className="grid size-24 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-3xl font-bold text-primary">{(settings?.siteName || 'A').charAt(0)}</div>}<div className="flex-1"><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Written by</p><h2 className="mt-2 text-2xl font-semibold">{about?.title || settings?.siteName || 'Portfolio Author'}</h2><p className="mt-1 font-medium text-foreground/80">AI Engineer &amp; Full Stack Developer</p>{about?.description ? <p className="mt-3 line-clamp-2 leading-7 text-muted-foreground">{about.description}</p> : null}<div className="mt-4 flex gap-2">{contact?.socialLinks?.map((social) => <a aria-label={social.platform} className="grid size-9 place-items-center rounded-full border border-white/12 bg-white/[.05] text-muted-foreground transition hover:border-primary/40 hover:text-primary" href={social.url} key={social.id || social.url} rel="noreferrer" target="_blank"><SocialIcon icon={social.icon} platform={social.platform} /></a>)}</div></div></div></Reveal>
      </section>

      <section className="container mt-16"><div className="mb-7"><p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Keep reading</p><h2 className="mt-2 text-3xl font-semibold sm:text-4xl">You may also like</h2></div><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{suggestions.map((item) => <BlogCard blog={item} key={item.id} />)}</div></section>

      {(previous || next) ? <nav className="container mt-14 grid gap-4 sm:grid-cols-2">{previous ? <Link className="polished-card group rounded-2xl p-5" href={`/blog/${previous.slug}`}><span className="text-xs uppercase tracking-[.17em] text-muted-foreground">Previous Article</span><span className="mt-3 flex items-center gap-2 font-semibold group-hover:text-primary"><ArrowLeft className="size-4" />{previous.title}</span></Link> : <div />}{next ? <Link className="polished-card group rounded-2xl p-5 text-right" href={`/blog/${next.slug}`}><span className="text-xs uppercase tracking-[.17em] text-muted-foreground">Next Article</span><span className="mt-3 flex items-center justify-end gap-2 font-semibold group-hover:text-primary">{next.title}<ArrowRight className="size-4" /></span></Link> : null}</nav> : null}

      <section className="container mt-16"><Reveal><div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-[radial-gradient(circle_at_top_left,rgba(0,214,201,.2),transparent_36%),rgba(13,18,27,.92)] px-6 py-12 text-center shadow-[0_30px_100px_rgba(0,214,201,.08)] sm:px-12"><p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Build what’s next</p><h2 className="mx-auto mt-3 max-w-3xl text-balance text-3xl font-semibold sm:text-4xl">Interested in AI, Agentic Systems, RAG, Mobile Apps, and Modern Software Engineering?</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">Explore more projects or get in touch to turn an ambitious idea into a polished product.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Button asChild><Link href="/projects"><FolderOpen className="size-4" />View Projects</Link></Button><Button asChild variant="outline"><Link href="/contact"><Mail className="size-4" />Contact Me</Link></Button></div></div></Reveal></section>
    </article>
  )
}
