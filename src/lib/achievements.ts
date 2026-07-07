import type { Achievement, Project } from '@/types/payload-types'

export function achievementSlug(achievement: Pick<Achievement, 'id' | 'title'>) {
  const base = achievement.title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return base || achievement.id
}

export function achievementPath(achievement: Pick<Achievement, 'id' | 'title'>) {
  return `/achievements/${achievementSlug(achievement)}`
}

export function findAchievementBySlug(achievements: Achievement[], slug: string) {
  return achievements.find((achievement) => achievementSlug(achievement) === slug) || null
}

export function getRelatedProject(achievement: Achievement): Project | null {
  if (!achievement.relatedProject || typeof achievement.relatedProject === 'string') return null

  return achievement.relatedProject
}
