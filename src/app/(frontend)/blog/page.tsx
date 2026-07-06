import { BlogSection } from '@/components/sections/BlogSection'
import { getCollection, getSiteSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Blog } from '@/types/payload-types'

export const revalidate = 60

export async function generateMetadata() {
  const settings = await getSiteSettings()
  return buildMetadata({
    path: '/blog',
    settings,
    title: settings?.siteName ? `Blog | ${settings.siteName}` : 'Blog'
  })
}

export default async function BlogPage() {
  const blogs = await getCollection<Blog>('blogs', { sort: '-publishedDate', limit: 200 })

  return (
    <div className="pt-16">
      <BlogSection blogs={blogs} showArchiveLink={false} />
    </div>
  )
}
