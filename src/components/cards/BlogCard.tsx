'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { formatDate, getMedia, getMediaUrl, textArray } from '@/lib/utils'
import type { Blog } from '@/types/payload-types'

export function BlogCard({ blog }: { blog: Blog }) {
  const image = getMedia(blog.coverImage)
  const imageUrl = getMediaUrl(blog.coverImage)
  const tags = textArray(blog.tags).slice(0, 3)
  const href = blog.slug ? `/blog/${blog.slug}` : '#'

  return (
    <motion.article
      className="group h-full overflow-hidden rounded-lg border border-white/12 bg-white/[0.035] transition hover:border-secondary/40"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.42 }}
    >
      <Link className="block h-full" href={href} aria-disabled={!blog.slug}>
        <div className="relative aspect-[16/9] overflow-hidden bg-white/[0.04]">
          {imageUrl ? (
            <Image
              alt={image?.alt || blog.title || 'Blog cover'}
              className="object-cover transition duration-700 group-hover:scale-105"
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              src={imageUrl}
            />
          ) : (
            <div className="grid h-full place-items-center bg-aurora">
              <FileText className="size-9 text-secondary" />
            </div>
          )}
        </div>
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {blog.publishedDate ? <span>{formatDate(blog.publishedDate)}</span> : null}
            {blog.featured ? <Badge className="border-secondary/35 text-secondary">Featured</Badge> : null}
          </div>
          <h3 className="text-xl font-semibold text-foreground">{blog.title}</h3>
          {blog.excerpt ? (
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{blog.excerpt}</p>
          ) : null}
          {tags.length ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </motion.article>
  )
}
