import type { MetadataRoute } from 'next'
import { achievementSlug } from '@/lib/achievements'
import { getBlogSlugs, getCollection, getProjectSlugs } from '@/lib/payload'
import { absoluteUrl } from '@/lib/utils'
import type { Achievement } from '@/types/payload-types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, blogSlugs, achievements] = await Promise.all([
    getProjectSlugs(),
    getBlogSlugs(),
    getCollection<Achievement>('achievements', { depth: 0, limit: 1000 })
  ])
  const achievementSlugs = achievements.map((achievement) => achievementSlug(achievement))
  const now = new Date()

  const staticRoutes = ['/', '/about', '/projects', '/blog', '/contact'].map((route) => ({
    changeFrequency: 'weekly' as const,
    lastModified: now,
    priority: route === '/' ? 1 : 0.8,
    url: absoluteUrl(route)
  }))

  const projectRoutes = projectSlugs.map((slug) => ({
    changeFrequency: 'monthly' as const,
    lastModified: now,
    priority: 0.7,
    url: absoluteUrl(`/projects/${slug}`)
  }))

  const blogRoutes = blogSlugs.map((slug) => ({
    changeFrequency: 'monthly' as const,
    lastModified: now,
    priority: 0.65,
    url: absoluteUrl(`/blog/${slug}`)
  }))

  const achievementRoutes = achievementSlugs.map((slug) => ({
    changeFrequency: 'monthly' as const,
    lastModified: now,
    priority: 0.6,
    url: absoluteUrl(`/achievements/${slug}`)
  }))

  return [...staticRoutes, ...projectRoutes, ...blogRoutes, ...achievementRoutes]
}
