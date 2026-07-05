import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import type {
  About,
  Achievement,
  Blog,
  Certificate,
  ContactInfo,
  Education,
  Experience,
  Hero,
  Service,
  SiteSetting,
  Testimonial
} from '@/types/payload-types'
import type { Project } from '@/types/project'
import type { Skill } from '@/types/skill'

let cachedPayload: Promise<Payload> | null = null

export async function getPayloadClient() {
  if (!process.env.DATABASE_URI) {
    throw new Error('DATABASE_URI is not configured.')
  }

  if (!cachedPayload) {
    cachedPayload = getPayload({ config })
  }

  return cachedPayload
}

type FindOptions = {
  depth?: number
  limit?: number
  page?: number
  sort?: string
  where?: Parameters<Payload['find']>[0]['where']
}

export async function getCollection<T>(collection: string, options: FindOptions = {}): Promise<T[]> {
  if (!process.env.DATABASE_URI) {
    return []
  }

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: collection as Parameters<Payload['find']>[0]['collection'],
      depth: options.depth ?? 2,
      draft: false,
      limit: options.limit ?? 100,
      page: options.page,
      sort: options.sort ?? 'order',
      where: options.where
    })

    return result.docs as T[]
  } catch (error) {
    console.error(`Payload read failed for ${collection}`, error)
    return []
  }
}

export async function getSingleton<T>(collection: string): Promise<T | null> {
  const docs = await getCollection<T>(collection, {
    depth: 2,
    limit: 1,
    sort: '-updatedAt'
  })

  return docs[0] || null
}

export async function findBySlug<T>(collection: string, slug: string): Promise<T | null> {
  const docs = await getCollection<T>(collection, {
    depth: 3,
    limit: 1,
    where: {
      slug: {
        equals: slug
      }
    }
  })

  return docs[0] || null
}

export async function getSiteSettings() {
  return getSingleton<SiteSetting>('site-settings')
}

export async function getContactInfo() {
  return getSingleton<ContactInfo>('contact-info')
}

export async function getHomeData() {
  const [
    hero,
    about,
    skills,
    projects,
    experience,
    education,
    achievements,
    certificates,
    testimonials,
    services,
    blogs,
    contactInfo,
    siteSettings
  ] = await Promise.all([
    getSingleton<Hero>('hero'),
    getSingleton<About>('about'),
    getCollection<Skill>('skills', { sort: 'order', limit: 100 }),
    getCollection<Project>('projects', { sort: 'order', limit: 100 }),
    getCollection<Experience>('experience', { sort: 'order', limit: 100 }),
    getCollection<Education>('education', { sort: 'order', limit: 100 }),
    getCollection<Achievement>('achievements', { sort: 'order', limit: 100 }),
    getCollection<Certificate>('certificates', { sort: 'order', limit: 100 }),
    getCollection<Testimonial>('testimonials', { sort: 'order', limit: 100 }),
    getCollection<Service>('services', { sort: 'order', limit: 100 }),
    getCollection<Blog>('blogs', { sort: '-publishedDate', limit: 6 }),
    getContactInfo(),
    getSiteSettings()
  ])

  return {
    about,
    achievements,
    blogs,
    certificates,
    contactInfo,
    education,
    experience,
    hero,
    projects,
    services,
    siteSettings,
    skills,
    testimonials
  }
}

export async function getProjectSlugs() {
  const projects = await getCollection<Project>('projects', { depth: 0, limit: 1000 })
  return projects.map((project) => project.slug).filter((slug): slug is string => Boolean(slug))
}

export async function getBlogSlugs() {
  const blogs = await getCollection<Blog>('blogs', { depth: 0, limit: 1000 })
  return blogs.map((blog) => blog.slug).filter((slug): slug is string => Boolean(slug))
}
