import Image from 'next/image'
import Link from 'next/link'
import { Mail, MapPin, MessageCircle } from 'lucide-react'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { getMediaUrl } from '@/lib/utils'
import type { ContactInfo, SiteSetting } from '@/types/payload-types'

type FooterProps = {
  settings?: SiteSetting | null
  contactInfo?: ContactInfo | null
}

const footerNavigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Services', href: '/#services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' }
]

export function Footer({ contactInfo, settings }: FooterProps) {
  const logoUrl = getMediaUrl(settings?.logo)
  const siteName = settings?.siteName || 'Portfolio'
  const description =
    settings?.siteDescription ||
    'Building AI-powered applications, intelligent mobile experiences, and scalable backend systems.'
  const socialLinks = contactInfo?.socialLinks || []
  const whatsappLink = socialLinks.find((link) =>
    link.platform.toLowerCase().includes('whatsapp')
  )
  const locationUrl = contactInfo?.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.location)}`
    : null
  const hasQuickContact = Boolean(contactInfo?.email || contactInfo?.location || whatsappLink?.url)

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-background/80 py-12 sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent shadow-[0_0_22px_rgba(0,214,201,0.2)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-0 -z-10 size-[28rem] rounded-full bg-primary/[0.045] blur-[110px]" />

      <div className="container">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.65fr_0.9fr_auto] lg:gap-12">
          <div className="max-w-md sm:col-span-2 lg:col-span-1">
            <Link className="inline-flex items-center gap-3 transition duration-300 hover:text-primary" href="/">
              {logoUrl ? (
                <Image alt={siteName} className="rounded-lg object-cover" height={40} src={logoUrl} width={40} />
              ) : (
                <span className="grid size-10 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-xs font-bold text-primary">
                  {siteName.slice(0, 2).toUpperCase()}
                </span>
              )}
              <span className="font-semibold tracking-wide">{siteName}</span>
            </Link>
            <p className="mt-5 text-sm font-semibold text-foreground/90">AI Engineer &amp; Full-Stack Developer</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
            <p className="mt-6 text-xs text-muted-foreground/70">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80">Navigate</p>
            <nav className="mt-4 grid gap-2.5" aria-label="Footer navigation">
              {footerNavigation.map((item) => (
                <Link className="w-fit text-sm text-muted-foreground transition duration-300 hover:translate-x-0.5 hover:text-primary" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {hasQuickContact ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80">Quick contact</p>
              <div className="mt-4 grid gap-3">
                {contactInfo?.email ? (
                  <Link className="flex min-w-0 items-center gap-2.5 text-sm text-muted-foreground transition duration-300 hover:text-primary" href={`mailto:${contactInfo.email}`}>
                    <Mail className="size-4 shrink-0 text-primary" />
                    <span className="truncate">{contactInfo.email}</span>
                  </Link>
                ) : null}
                {whatsappLink?.url ? (
                  <Link className="flex items-center gap-2.5 text-sm text-muted-foreground transition duration-300 hover:text-primary" href={whatsappLink.url} rel="noreferrer" target="_blank">
                    <MessageCircle className="size-4 shrink-0 text-primary" />
                    WhatsApp
                  </Link>
                ) : null}
                {contactInfo?.location && locationUrl ? (
                  <Link className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground transition duration-300 hover:text-primary" href={locationUrl} rel="noreferrer" target="_blank">
                    <MapPin className="mt-1 size-4 shrink-0 text-primary" />
                    {contactInfo.location}
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}

          {socialLinks.length ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80">Connect</p>
              <div className="mt-4 flex max-w-[12rem] flex-wrap gap-2.5 lg:justify-end">
                {socialLinks.map((link) =>
                  link.url ? (
                    <Link
                      aria-label={link.platform}
                      className="grid size-10 place-items-center rounded-xl border border-white/[0.14] bg-white/[0.045] text-muted-foreground shadow-[0_8px_22px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:bg-primary/[0.1] hover:text-primary hover:shadow-[0_10px_28px_rgba(0,214,201,0.1)]"
                      href={link.url}
                      key={`${link.platform}-${link.url}`}
                      rel="noreferrer"
                      target="_blank"
                      title={link.platform}
                    >
                      <SocialIcon className="size-[1.05rem]" icon={link.icon} platform={link.platform} />
                    </Link>
                  ) : null
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
