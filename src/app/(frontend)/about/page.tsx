import { AboutSection } from '@/components/sections/AboutSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { getCollection, getSingleton, getSiteSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { About, Education, Experience } from '@/types/payload-types'
import type { Skill } from '@/types/skill'

export const revalidate = 60

export async function generateMetadata() {
  const settings = await getSiteSettings()
  return buildMetadata({
    path: '/about',
    settings,
    title: settings?.siteName ? `About | ${settings.siteName}` : 'About'
  })
}

export default async function AboutPage() {
  const [about, skills, experience, education] = await Promise.all([
    getSingleton<About>('about'),
    getCollection<Skill>('skills', { sort: 'order' }),
    getCollection<Experience>('experience', { sort: 'order' }),
    getCollection<Education>('education', { sort: 'order' })
  ])

  return (
    <div className="pt-20">
      <AboutSection about={about} />
      <SkillsSection skills={skills} />
      <ExperienceSection experience={experience} />
      <EducationSection education={education} />
    </div>
  )
}
