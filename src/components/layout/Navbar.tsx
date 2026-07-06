'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getMediaUrl } from '@/lib/utils'
import type { ContactInfo, SiteSetting } from '@/types/payload-types'
import { MobileMenu } from './MobileMenu'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' }
]

type NavbarProps = {
  settings?: SiteSetting | null
  contactInfo?: ContactInfo | null
}

export function Navbar({ contactInfo, settings }: NavbarProps) {
  const logoUrl = getMediaUrl(settings?.logo)
  const siteName = settings?.siteName || 'Portfolio'

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/72 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border border-primary/35 bg-primary/10 shadow-glow">
            {logoUrl ? (
              <Image alt={siteName} className="object-cover" fill sizes="48px" src={logoUrl} />
            ) : (
              <span className="text-sm font-bold text-primary">{siteName.slice(0, 2).toUpperCase()}</span>
            )}
          </span>
          <span className="truncate text-sm font-semibold uppercase tracking-[0.22em]">{siteName}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.05] hover:text-foreground"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button asChild variant="outline">
            <Link href={contactInfo?.email ? `mailto:${contactInfo.email}` : '/contact'}>
              <ArrowUpRight className="size-4" />
              Start a Project
            </Link>
          </Button>
        </div>
        <MobileMenu items={navItems} />
      </div>
    </header>
  )
}
