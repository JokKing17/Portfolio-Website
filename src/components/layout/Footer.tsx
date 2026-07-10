import Image from 'next/image'
import Link from 'next/link'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { getMediaUrl } from '@/lib/utils'
import type { ContactInfo, SiteSetting } from '@/types/payload-types'

type FooterProps = {
  settings?: SiteSetting | null
  contactInfo?: ContactInfo | null
}

export function Footer({ contactInfo, settings }: FooterProps) {
  const logoUrl = getMediaUrl(settings?.logo)
  const siteName = settings?.siteName || 'Portfolio'
  const footerText = settings?.footerText || `Built with Next.js, Payload CMS, and motion.`
  const socialLinks = contactInfo?.socialLinks || []

  return (
    <footer className="border-t border-white/10 bg-background/70 py-10">
      <div className="container flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <Link className="mb-3 inline-flex items-center gap-3" href="/">
            {logoUrl ? (
              <Image alt={siteName} className="rounded-md object-cover" height={36} src={logoUrl} width={36} />
            ) : (
              <span className="grid size-9 place-items-center rounded-md border border-primary/30 bg-primary/10 text-xs font-bold text-primary">
                {siteName.slice(0, 2).toUpperCase()}
              </span>
            )}
            <span className="font-semibold">{siteName}</span>
          </Link>
          <p className="text-sm leading-6 text-muted-foreground">{footerText}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {socialLinks.map((link) =>
            link.url ? (
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                href={link.url}
                key={`${link.platform}-${link.url}`}
                rel="noreferrer"
                target="_blank"
              >
                <SocialIcon icon={link.icon} platform={link.platform} />
                {link.platform}
              </Link>
            ) : null
          )}
        </div>
      </div>
    </footer>
  )
}
