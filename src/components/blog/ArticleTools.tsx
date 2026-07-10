'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronDown, Copy, Facebook, Linkedin, Share2, Twitter } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ArticleHeading = { id: string; label: string; level: string }

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0)
    }
    update(); window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <div className="fixed inset-x-0 top-0 z-[70] h-0.5 bg-white/5"><div className="h-full bg-primary shadow-[0_0_12px_rgba(0,214,201,.8)]" style={{ width: `${progress}%` }} /></div>
}

export function ShareButtons({ compact = false, title }: { compact?: boolean; title: string }) {
  const [copied, setCopied] = useState(false)
  const share = (network: string) => {
    const url = encodeURIComponent(window.location.href); const label = encodeURIComponent(title)
    const links: Record<string, string> = { linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, twitter: `https://twitter.com/intent/tweet?url=${url}&text=${label}`, facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}` }
    window.open(links[network], '_blank', 'noopener,noreferrer,width=720,height=520')
  }
  const buttons = [['linkedin', Linkedin], ['twitter', Twitter], ['facebook', Facebook]] as const
  return <div className="flex flex-wrap items-center gap-2">{buttons.map(([name, Icon]) => <button aria-label={`Share on ${name}`} className="grid size-10 place-items-center rounded-full border border-white/12 bg-white/[.055] text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary" key={name} onClick={() => share(name)}><Icon className="size-4" /></button>)}<button aria-label="Copy article link" className={cn('grid size-10 place-items-center rounded-full border border-white/12 bg-white/[.055] transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary', copied ? 'text-primary' : 'text-muted-foreground')} onClick={async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1600) }}>{copied ? <Check className="size-4" /> : <Copy className="size-4" />}</button>{!compact && <span className="ml-1 text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Share</span>}</div>
}

export function TableOfContents({ headings }: { headings: ArticleHeading[] }) {
  const [active, setActive] = useState(headings[0]?.id || '')
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)), { rootMargin: '-20% 0px -70%' })
    headings.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [headings])
  if (!headings.length) return null
  const links = <nav className="grid gap-1.5">{headings.map((heading) => <a className={cn('border-l-2 py-1.5 pl-3 text-sm leading-5 transition', heading.level === 'h3' && 'ml-3', active === heading.id ? 'border-primary text-primary' : 'border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground')} href={`#${heading.id}`} key={heading.id}>{heading.label}</a>)}</nav>
  return <><div className="rounded-2xl border border-white/12 bg-white/[.035] p-4 lg:hidden"><button className="flex w-full items-center justify-between font-semibold" onClick={() => setOpen(!open)}>Table of contents<ChevronDown className={cn('size-4 transition', open && 'rotate-180')} /></button>{open && <div className="mt-4">{links}</div>}</div><aside className="hidden lg:block"><div className="sticky top-24 rounded-2xl border border-white/12 bg-[rgba(13,18,27,.88)] p-5 backdrop-blur-xl"><p className="mb-4 flex items-center gap-2 text-sm font-semibold"><Share2 className="size-4 text-primary" />In this article</p>{links}</div></aside></>
}
