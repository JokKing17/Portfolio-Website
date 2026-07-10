'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Clock3, FileText, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { formatDate, getMedia, getMediaUrl, textArray } from '@/lib/utils'
import type { Blog } from '@/types/payload-types'
import { getReadingTime } from '@/lib/blog'

export function BlogCard({ blog }: { blog: Blog }) {
  const image = getMedia(blog.coverImage)
  const imageUrl = getMediaUrl(blog.coverImage)
  const tags = textArray(blog.tags).slice(0, 3)
  const href = blog.slug ? `/blog/${blog.slug}` : '#'
  const readingTime = getReadingTime(blog.content)
  const category = tags[0] || 'Article'

  return (
    <motion.article
      className="group h-full rounded-2xl bg-gradient-to-br from-primary/35 via-white/[0.12] to-accent/20 p-px shadow-[0_18px_60px_rgba(0,0,0,.3)] transition duration-300 hover:shadow-[0_30px_86px_rgba(0,214,201,.13)]"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Link className="flex h-full min-h-[560px] flex-col overflow-hidden rounded-[15px] border border-white/[.14] bg-[rgba(13,18,27,.95)] p-2.5 backdrop-blur-md transition duration-300 group-hover:border-primary/40 group-hover:bg-[rgba(16,23,33,.97)]" href={href} aria-disabled={!blog.slug}>
        <div className="relative aspect-[16/11] overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(0,214,201,.08),transparent_55%),rgba(255,255,255,.025)]">
          {imageUrl ? (
            <Image
              alt={image?.alt || blog.title || 'Blog cover'}
              className="object-contain transition duration-700 ease-out group-hover:scale-[1.025]"
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              src={imageUrl}
            />
          ) : (
            <div className="grid h-full place-items-center bg-aurora">
              <FileText className="size-9 text-secondary" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          {blog.featured ? <Badge className="absolute left-4 top-4 rounded-full border-primary/40 bg-background/85 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-primary backdrop-blur"><Sparkles className="mr-1.5 size-3" />Featured</Badge> : null}
        </div>
        <div className="flex flex-1 flex-col px-3 pb-3 pt-6 sm:px-4 sm:pb-4 sm:pt-7">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
            {blog.publishedDate ? <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5 text-primary" />{formatDate(blog.publishedDate)}</span> : null}
            <span className="text-white/20">•</span><span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5 text-primary" />{readingTime} min read</span>
            <Badge className="ml-auto rounded-full border-secondary/25 bg-secondary/10 px-2.5 py-1 text-[10px] uppercase tracking-[.15em] text-secondary">{category}</Badge>
          </div>
          <h3 className="mt-5 line-clamp-2 min-h-[3.8rem] text-balance text-[1.45rem] font-semibold leading-[1.3] tracking-[-0.015em] text-foreground transition group-hover:text-primary">{blog.title}</h3>
          {blog.excerpt ? (
            <p className="mt-4 line-clamp-3 text-[.925rem] leading-7 text-muted-foreground">{blog.excerpt}</p>
          ) : null}
          {tags.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge className="rounded-full border-white/12 bg-white/[.06] px-3 py-1.5 text-[11px] transition hover:border-primary/35 hover:bg-primary/10 hover:text-primary" key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : null}
          <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 text-sm font-semibold"><span className="inline-flex items-center gap-2 py-1 text-foreground transition group-hover:translate-x-0.5 group-hover:text-primary">Read Article <span className="grid size-7 place-items-center rounded-full border border-white/10 bg-white/[.06] transition group-hover:border-primary/35 group-hover:bg-primary/10"><ArrowUpRight className="size-3.5 transition group-hover:translate-x-px group-hover:-translate-y-px" /></span></span><span className="text-xs font-medium text-muted-foreground">{readingTime} min read</span></div>
        </div>
      </Link>
    </motion.article>
  )
}
