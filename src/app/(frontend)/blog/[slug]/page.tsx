import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { RichText } from '@/components/ui/RichText'
import { findBySlug, getBlogSlugs, getSiteSettings } from '@/lib/payload'
import { blogMetadata } from '@/lib/seo'
import { formatDate, getMedia, getMediaUrl, textArray } from '@/lib/utils'
import type { Blog } from '@/types/payload-types'

export const revalidate = 60

type PageProps = {
  params: Promise<{ slug: string }>
}

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
  const blog = await findBySlug<Blog>('blogs', slug)
  if (!blog) notFound()

  const cover = getMedia(blog.coverImage)
  const coverUrl = getMediaUrl(blog.coverImage)
  const tags = textArray(blog.tags)

  return (
    <article className="pt-24">
      <header className="container max-w-4xl pb-10">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          {blog.publishedDate ? formatDate(blog.publishedDate) : 'Article'}
        </p>
        <h1 className="text-balance text-4xl font-semibold sm:text-6xl">{blog.title}</h1>
        {blog.excerpt ? <p className="mt-6 text-lg leading-8 text-muted-foreground">{blog.excerpt}</p> : null}
        {tags.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        ) : null}
      </header>
      <div className="container">
        <div className="relative aspect-[16/8] overflow-hidden rounded-lg border border-white/12 bg-white/[0.04]">
          {coverUrl ? (
            <Image
              alt={cover?.alt || blog.title || 'Blog cover'}
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
      <section className="container max-w-4xl py-12">
        <RichText content={blog.content} />
      </section>
    </article>
  )
}
