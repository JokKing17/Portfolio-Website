import { ContactSection } from '@/components/sections/ContactSection'
import { getContactInfo, getSiteSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata() {
  const settings = await getSiteSettings()
  return buildMetadata({
    path: '/contact',
    settings,
    title: settings?.siteName ? `Contact | ${settings.siteName}` : 'Contact'
  })
}

export default async function ContactPage() {
  const contactInfo = await getContactInfo()

  return (
    <div className="pt-16">
      <ContactSection contactInfo={contactInfo} />
    </div>
  )
}
