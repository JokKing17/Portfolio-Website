import type { ReactNode } from 'react'
import { AboutSection } from '@/components/sections/AboutSection'
import { AchievementsSection } from '@/components/sections/AchievementsSection'
import { BlogSection } from '@/components/sections/BlogSection'
import { CertificatesSection } from '@/components/sections/CertificatesSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { getHomeData } from '@/lib/payload'
import { buildMetadata, personSchema } from '@/lib/seo'
import { absoluteUrl, getMediaUrl } from '@/lib/utils'
import type { SectionKey, SectionSetting } from '@/types/common'

export const revalidate = 60

const defaultSections: SectionKey[] = [
  'about',
  'skills',
  'experience',
  'education',
  'featured-projects',
  'projects',
  'achievements',
  'certificates',
  'services',
  'testimonials',
  'blog',
  'contact'
]

function orderedSections(settings?: SectionSetting[] | null) {
  if (!settings?.length) return defaultSections

  const hidden = settings
    .filter((section) => section.key && section.visible === false)
    .map((section) => section.key)

  const configured = settings
    .filter((section): section is SectionSetting & { key: SectionKey } =>
      Boolean(section.key && section.visible !== false)
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((section) => section.key)

  return [
    ...configured,
    ...defaultSections.filter((section) => !configured.includes(section) && !hidden.includes(section))
  ]
}

function labelFor(settings: SectionSetting[] | null | undefined, key: SectionKey) {
  return settings?.find((section) => section.key === key)?.label || undefined
}

export async function generateMetadata() {
  const { siteSettings } = await getHomeData()
  return buildMetadata({ settings: siteSettings })
}

export default async function HomePage() {
  const data = await getHomeData()
  const sectionSettings = (data.siteSettings?.sectionOrder || undefined) as SectionSetting[] | undefined

  const sections: Record<SectionKey, ReactNode> = {
    about: <AboutSection about={data.about} heading={labelFor(sectionSettings, 'about')} />,
    achievements: (
      <AchievementsSection
        achievements={data.achievements}
        heading={labelFor(sectionSettings, 'achievements')}
      />
    ),
    blog: <BlogSection blogs={data.blogs} heading={labelFor(sectionSettings, 'blog')} />,
    certificates: (
      <CertificatesSection
        certificates={data.certificates}
        heading={labelFor(sectionSettings, 'certificates')}
      />
    ),
    contact: <ContactSection contactInfo={data.contactInfo} heading={labelFor(sectionSettings, 'contact')} />,
    education: (
      <EducationSection education={data.education} heading={labelFor(sectionSettings, 'education')} />
    ),
    experience: (
      <ExperienceSection experience={data.experience} heading={labelFor(sectionSettings, 'experience')} />
    ),
    'featured-projects': (
      <ProjectsSection
        featuredOnly
        heading={labelFor(sectionSettings, 'featured-projects')}
        limit={6}
        projects={data.projects}
      />
    ),
    projects: (
      <ProjectsSection
        heading={labelFor(sectionSettings, 'projects')}
        limit={6}
        projects={data.projects}
      />
    ),
    services: <ServicesSection heading={labelFor(sectionSettings, 'services')} services={data.services} />,
    skills: <SkillsSection heading={labelFor(sectionSettings, 'skills')} skills={data.skills} />,
    testimonials: (
      <TestimonialsSection
        heading={labelFor(sectionSettings, 'testimonials')}
        testimonials={data.testimonials}
      />
    )
  }

  const schema = personSchema({
    description: data.hero?.shortBio,
    image: getMediaUrl(data.hero?.profileImage),
    name: data.hero?.name,
    role: data.hero?.role,
    sameAs: data.hero?.socialLinks?.map((link) => link.url).filter((url): url is string => Boolean(url)),
    url: absoluteUrl('/')
  })

  return (
    <>
      <HeroSection hero={data.hero} settings={data.siteSettings} />
      {orderedSections(sectionSettings).map((key) => (
        <div key={key}>{sections[key]}</div>
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
