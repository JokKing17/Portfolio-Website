import type { MetadataRoute } from 'next'
import { getBlogSlugs, getProjectSlugs } from '@/lib/payload'
import { absoluteUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, blogSlugs] = await Promise.all([getProjectSlugs(), getBlogSlugs()])
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

  return [...staticRoutes, ...projectRoutes, ...blogRoutes]
}
