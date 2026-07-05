import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { getCollection, getSiteSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Project } from '@/types/project'

export const revalidate = 60

export async function generateMetadata() {
  const settings = await getSiteSettings()
  return buildMetadata({
    path: '/projects',
    settings,
    title: settings?.siteName ? `Projects | ${settings.siteName}` : 'Projects'
  })
}

export default async function ProjectsPage() {
  const projects = await getCollection<Project>('projects', { sort: 'order', limit: 200 })

  return (
    <div className="pt-20">
      <ProjectsSection projects={projects} showArchiveLink={false} />
    </div>
  )
}
