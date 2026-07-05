'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type NavItem = {
  label: string
  href: string
}

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button aria-label="Open menu" onClick={() => setOpen(true)} size="icon" variant="outline">
        <Menu className="size-4" />
      </Button>
      {open ? (
        <div className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-xl">
          <div className="container flex h-20 items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Menu</span>
            <Button aria-label="Close menu" onClick={() => setOpen(false)} size="icon" variant="outline">
              <X className="size-4" />
            </Button>
          </div>
          <nav className="container grid gap-3 py-10">
            {items.map((item) => (
              <Link
                className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-4 text-lg font-medium"
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  )
}
