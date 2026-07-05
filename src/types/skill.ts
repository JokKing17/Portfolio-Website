import type { MediaRelation } from './common'

export type Skill = {
  id: string
  name?: string
  category?: string
  icon?: MediaRelation
  level?: number
  description?: string
  order?: number
}
