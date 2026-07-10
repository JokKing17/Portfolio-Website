'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, Facebook, Linkedin, Twitter } from 'lucide-react'
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
  const labels: Record<string, string> = { linkedin: 'Share on LinkedIn', twitter: 'Share on X', facebook: 'Share on Facebook' }
  return <div className="flex flex-wrap items-center gap-2.5">{buttons.map(([name, Icon]) => <button aria-label={labels[name]} title={labels[name]} className="grid size-10 place-items-center rounded-full border border-white/12 bg-white/[.055] text-muted-foreground shadow-[0_8px_24px_rgba(0,0,0,.14)] transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-[0_10px_28px_rgba(0,214,201,.1)]" key={name} onClick={() => share(name)}><Icon className="size-4" /></button>)}<button aria-label="Copy article link" title={copied ? 'Link copied' : 'Copy link'} className={cn('grid size-10 place-items-center rounded-full border border-white/12 bg-white/[.055] shadow-[0_8px_24px_rgba(0,0,0,.14)] transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/10 hover:text-primary', copied ? 'border-primary/40 bg-primary/10 text-primary' : 'text-muted-foreground')} onClick={async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1600) }}>{copied ? <Check className="size-4" /> : <Copy className="size-4" />}</button>{!compact && <span className="ml-1 text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Share</span>}</div>
}

export function ArticleSectionNav({ headings }: { headings: ArticleHeading[] }) {
  const [active, setActive] = useState(headings[0]?.id || '')
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)), { rootMargin: '-20% 0px -70%' })
    headings.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el) })
    const updateProgress = () => {
      const article = document.getElementById('article-body')
      if (!article) return
      const start = article.offsetTop - window.innerHeight * 0.25
      const distance = Math.max(1, article.offsetHeight - window.innerHeight * 0.55)
      setProgress(Math.min(100, Math.max(0, ((window.scrollY - start) / distance) * 100)))
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => { observer.disconnect(); window.removeEventListener('scroll', updateProgress) }
  }, [headings])
  if (!headings.length) return null
  return <div className="sticky top-16 z-40 border-y border-white/10 bg-[rgba(7,11,18,.9)] py-3 shadow-[0_16px_45px_rgba(0,0,0,.18)] backdrop-blur-xl"><div className="container"><div className="flex items-center justify-between gap-4"><p className="shrink-0 text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">In this article</p><span className="text-xs font-semibold tabular-nums text-primary">{Math.round(progress)}%</span></div><nav aria-label="Article sections" className="mt-2 flex snap-x gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{headings.map((heading) => <a className={cn('shrink-0 snap-start rounded-full border px-3 py-1.5 text-xs transition duration-300', active === heading.id ? 'border-primary/40 bg-primary/10 font-semibold text-primary' : 'border-white/10 bg-white/[.035] text-muted-foreground hover:border-white/25 hover:text-foreground')} href={`#${heading.id}`} key={heading.id} onClick={(event) => { event.preventDefault(); document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>{heading.label}</a>)}</nav><div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[.08]"><div className="h-full rounded-full bg-primary shadow-[0_0_12px_rgba(0,214,201,.65)] transition-[width] duration-150" style={{ width: `${progress}%` }} /></div></div></div>
}
