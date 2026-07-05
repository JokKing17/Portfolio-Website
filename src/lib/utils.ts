import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { MediaAsset, MediaRelation, TextItem } from '@/types/common'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMedia(media: MediaRelation): MediaAsset | null {
  if (!media || typeof media === 'string') return null
  return media
}

export function getMediaUrl(media: MediaRelation): string | undefined {
  const asset = getMedia(media)
  if (!asset?.url) return undefined

  if (asset.url.startsWith('http')) return asset.url
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  return `${baseUrl}${asset.url}`
}

export function textArray(items?: TextItem[] | null): string[] {
  if (!items?.length) return []

  return items
    .map((item) => item.item || item.technology || item.tag)
    .filter((value): value is string => Boolean(value))
}

export function formatDate(value?: string | null) {
  if (!value) return ''

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric'
  }).format(new Date(value))
}

export function absoluteUrl(path = '/') {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  return new URL(path, baseUrl).toString()
}
