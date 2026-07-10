'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedText } from '@/components/animations/AnimatedText'
import { MagneticButton } from '@/components/animations/MagneticButton'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/EmptyState'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { getMedia, getMediaUrl } from '@/lib/utils'
import type { Hero, SiteSetting } from '@/types/payload-types'

const HeroCanvas = dynamic(() => import('@/components/three/HeroCanvas'), {
  loading: () => <div className="absolute inset-0 bg-aurora" />,
  ssr: false
})

type HeroSectionProps = {
  hero?: Hero | null
  settings?: SiteSetting | null
}

export function HeroSection({ hero, settings }: HeroSectionProps) {
  const profileImage = getMedia(hero?.profileImage)
  const profileImageUrl = getMediaUrl(hero?.profileImage)
  const modelUrl = getMediaUrl(hero?.hero3DModel)
  const resumeUrl = getMediaUrl(hero?.resumeFile)

  if (!hero) {
    return (
      <section className="container grid min-h-screen place-items-center pt-20">
        <EmptyState
          title="Hero content is not published yet."
          description="Publish the main introduction to reveal this section."
        />
      </section>
    )
  }

  return (
    <section className="relative isolate min-h-screen overflow-hidden pt-16">
      <HeroCanvas modelUrl={modelUrl} particles={settings?.themeSettings?.enableParticles !== false} />
      <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-background/64 to-background" />
      <div className="container relative z-10 grid min-h-[calc(100svh-4rem)] items-start gap-10 pt-10 pb-12 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16">
        <div className="max-w-4xl">
          <motion.p
            className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-primary"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {hero.role}
          </motion.p>
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
            <AnimatedText text={hero.name} />
          </h1>
          {hero.headline ? (
            <motion.p
              className="mt-6 max-w-3xl text-xl leading-8 text-muted-foreground sm:text-2xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
            >
              {hero.headline}
            </motion.p>
          ) : null}
          {hero.shortBio ? (
            <motion.p
              className="mt-5 max-w-2xl leading-7 text-muted-foreground"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.55 }}
            >
              {hero.shortBio}
            </motion.p>
          ) : null}
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.55 }}
          >
            {hero.primaryButtonText && hero.primaryButtonLink ? (
              <MagneticButton>
                <Button asChild size="lg">
                  <Link href={hero.primaryButtonLink}>
                    {hero.primaryButtonText}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </MagneticButton>
            ) : null}
            {hero.secondaryButtonText && hero.secondaryButtonLink ? (
              <MagneticButton>
                <Button asChild size="lg" variant="outline">
                  <Link href={hero.secondaryButtonLink}>
                    {hero.secondaryButtonText}
                    <ArrowDown className="size-4" />
                  </Link>
                </Button>
              </MagneticButton>
            ) : null}
            {resumeUrl ? (
              <MagneticButton>
                <Button asChild size="lg" variant="secondary">
                  <Link href={resumeUrl} target="_blank">
                    Resume
                    <Download className="size-4" />
                  </Link>
                </Button>
              </MagneticButton>
            ) : null}
          </motion.div>
          {hero.socialLinks?.length ? (
            <motion.div
              className="mt-7 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              {hero.socialLinks.map((link) =>
                link.url ? (
                  <Link
                    className="rounded-md border border-white/12 bg-white/[0.04] px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-primary"
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
            </motion.div>
          ) : null}
        </div>
        <motion.div
          className="relative order-last mx-auto mt-2 aspect-square w-full max-w-[21rem] sm:max-w-[26rem] md:max-w-[30rem] lg:mt-0 lg:max-w-[34rem] xl:max-w-[38rem]"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            className="relative size-full"
            transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
          >
            <div className="absolute inset-4 rounded-full border border-primary/20 shadow-glow sm:inset-6 lg:inset-8" />
            <div className="absolute inset-8 rounded-full border border-primary/10 shadow-[0_0_90px_rgba(0,214,201,0.2)] sm:inset-10 lg:inset-12" />
            <div className="absolute -inset-2 rounded-full border border-primary/10 opacity-60" />
            {profileImageUrl ? (
              <div className="absolute inset-4 overflow-hidden rounded-full border border-primary/45 bg-white/[0.06] p-1.5 shadow-2xl shadow-primary/25 backdrop-blur-xl sm:inset-6 lg:inset-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-transparent to-secondary/25" />
                <div className="relative size-full overflow-hidden rounded-full border border-white/15 bg-background">
                  <Image
                    alt={profileImage?.alt || hero.name || 'Profile image'}
                    className="object-cover object-center"
                    fill
                    priority
                    sizes="(min-width: 1280px) 560px, (min-width: 1024px) 500px, (min-width: 768px) 448px, 336px"
                    src={profileImageUrl}
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-background/30 via-transparent to-white/5" />
                </div>
              </div>
            ) : null}
            <div className="absolute right-4 top-1/3 size-9 rounded-full border border-primary/40 bg-primary/70 shadow-glow sm:size-11" />
            <div className="absolute bottom-1/4 left-5 size-3 rounded-full bg-primary shadow-glow sm:size-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
