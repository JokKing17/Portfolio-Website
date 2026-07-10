'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BlogCard } from '@/components/cards/BlogCard'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Blog } from '@/types/payload-types'

export function BlogSection({
  blogs,
  heading,
  showArchiveLink = true
}: {
  blogs: Blog[]
  heading?: string
  showArchiveLink?: boolean
}) {
  return (
    <section className="section-shell container" id="blog">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow="Writing" title={heading || 'Blog'} />
        {showArchiveLink ? (
          <Button asChild className="mb-10 self-start" variant="outline">
            <Link href="/blog">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : null}
      </div>
      {!blogs.length ? (
        <EmptyState title="No blog posts published yet." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard blog={blog} key={blog.id} />
          ))}
        </div>
      )}
    </section>
  )
}
