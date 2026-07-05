import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { CustomCursor } from '@/components/animations/CustomCursor'
import { PageLoader } from '@/components/animations/PageLoader'
import { PageTransition } from '@/components/animations/PageTransition'
import { SmoothScroll } from '@/components/animations/SmoothScroll'
import { getContactInfo, getSiteSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { getMediaUrl } from '@/lib/utils'
import '../globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const favicon = getMediaUrl(settings?.favicon)

  return {
    ...buildMetadata({ settings }),
    icons: favicon ? [{ rel: 'icon', url: favicon }] : undefined
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#05070c',
  width: 'device-width',
  initialScale: 1
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const [settings, contactInfo] = await Promise.all([getSiteSettings(), getContactInfo()])

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SmoothScroll />
        <PageLoader
          enabled={settings?.themeSettings?.enablePageLoader !== false}
          siteName={settings?.siteName}
        />
        <CustomCursor enabled={settings?.themeSettings?.enableCustomCursor !== false} />
        <Navbar contactInfo={contactInfo} settings={settings} />
        <PageTransition>{children}</PageTransition>
        <Footer contactInfo={contactInfo} settings={settings} />
      </body>
    </html>
  )
}
