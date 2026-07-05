export type MediaAsset = {
  id?: string | null
  url?: string | null
  alt?: string | null
  caption?: string | null
  filename?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
}

export type MediaRelation = string | MediaAsset | null | undefined

export type TextItem = {
  id?: string | null
  item?: string | null
  technology?: string | null
  tag?: string | null
}

export type SocialLink = {
  id?: string | null
  platform?: string | null
  url?: string | null
  icon?: string | null
}

export type SectionKey =
  | 'about'
  | 'skills'
  | 'experience'
  | 'education'
  | 'featured-projects'
  | 'projects'
  | 'achievements'
  | 'certificates'
  | 'services'
  | 'testimonials'
  | 'blog'
  | 'contact'

export type SectionSetting = {
  id?: string | null
  key?: SectionKey | null
  label?: string | null
  visible?: boolean | null
  order?: number | null
}
