import type { Metadata } from 'next'
import type { Blog, SiteSetting } from '@/types/payload-types'
import type { Project } from '@/types/project'
import { absoluteUrl, getMediaUrl } from './utils'

type MetadataInput = {
  title?: string
  description?: string
  image?: string
  path?: string
  settings?: SiteSetting | null
}

export function buildMetadata({
  description,
  image,
  path = '/',
  settings,
  title
}: MetadataInput): Metadata {
  const siteName = settings?.siteName || 'Dynamic Developer Portfolio'
  const resolvedTitle = title || settings?.defaultSeoTitle || siteName
  const resolvedDescription =
    description || settings?.defaultSeoDescription || settings?.siteDescription || ''
  const imageUrl = image || getMediaUrl(settings?.defaultOgImage)
  const url = absoluteUrl(path)

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      siteName,
      url,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: imageUrl ? [imageUrl] : undefined
    }
  }
}

export function projectMetadata(project: Project | null, settings: SiteSetting | null): Metadata {
  return buildMetadata({
    title: project?.title,
    description: project?.shortDescription,
    image: getMediaUrl(project?.coverImage),
    path: `/projects/${project?.slug || ''}`,
    settings
  })
}

export function blogMetadata(blog: Blog | null, settings: SiteSetting | null): Metadata {
  return buildMetadata({
    title: blog?.seoTitle || blog?.title,
    description: blog?.seoDescription || blog?.excerpt,
    image: getMediaUrl(blog?.coverImage),
    path: `/blog/${blog?.slug || ''}`,
    settings
  })
}

export function personSchema(input: {
  name?: string
  role?: string
  description?: string
  image?: string
  url?: string
  sameAs?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    description: input.description,
    image: input.image,
    jobTitle: input.role,
    name: input.name,
    sameAs: input.sameAs,
    url: input.url || absoluteUrl('/')
  }
}
