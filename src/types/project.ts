import type { MediaRelation, TextItem } from './common'

export type Project = {
  id: string
  title?: string
  slug?: string
  shortDescription?: string
  fullDescription?: string
  coverImage?: MediaRelation
  galleryImages?: MediaRelation[]
  techStack?: TextItem[]
  category?: string
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
  projectType?: string
  startDate?: string
  endDate?: string
  challenges?: string
  solution?: string
  results?: string
  metrics?: TextItem[]
  order?: number
}
