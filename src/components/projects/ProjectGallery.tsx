'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Images, Maximize2, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type GalleryItem = {
  alt: string
  height?: number
  url: string
  width?: number
}

type ProjectGalleryProps = {
  images: GalleryItem[]
  title?: string
}

function getGalleryShape(image: GalleryItem) {
  const width = image.width || 1200
  const height = image.height || 900
  const ratio = Math.max(width / height, 0.2)
  const colSpan = ratio > 1.18 ? 2 : 1
  const rowSpan = Math.max(24, Math.min(58, Math.round((colSpan / ratio) * 28)))

  return {
    colSpan,
    height,
    rowSpan,
    width
  }
}

export function ProjectGallery({ images, title = 'Project gallery' }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeImage = activeIndex === null ? null : images[activeIndex]
  const currentIndex = activeIndex ?? 0

  useEffect(() => {
    if (activeIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null)
      if (event.key === 'ArrowRight') {
        setActiveIndex((index) => (index === null ? 0 : (index + 1) % images.length))
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((index) => (index === null ? 0 : (index - 1 + images.length) % images.length))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, images.length])

  if (!images.length) return null

  return (
    <section className="container pb-16 sm:pb-20">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <Images className="size-4" />
            Gallery
          </p>
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">Project visuals</h2>
        </div>
        <span className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground">
          {images.length} {images.length === 1 ? 'image' : 'images'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-flow-dense md:grid-cols-4 md:auto-rows-[10px]">
        {images.map((image, index) => {
          const shape = getGalleryShape(image)
          const style = {
            '--gallery-col-span': shape.colSpan,
            '--gallery-row-span': shape.rowSpan
          } as CSSProperties

          return (
            <motion.button
              className={cn(
                'group overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] text-left shadow-[0_26px_90px_rgba(0,0,0,0.28)] transition duration-300 hover:border-primary/35 hover:shadow-[0_28px_100px_rgba(0,214,201,0.13)]',
                'md:[grid-column-end:span_var(--gallery-col-span)] md:[grid-row-end:span_var(--gallery-row-span)]'
              )}
              initial={{ opacity: 0, y: 24 }}
              key={`${image.url}-${index}`}
              onClick={() => setActiveIndex(index)}
              style={style}
              type="button"
              viewport={{ once: true, amount: 0.2 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.25), duration: 0.55 }}
            >
              <div className="relative flex h-full min-h-0 items-center justify-center bg-background/35">
                <Image
                  alt={image.alt}
                  className="h-auto w-full object-contain transition duration-700 group-hover:scale-[1.025] md:h-full"
                  height={shape.height}
                  loading="lazy"
                  sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
                  src={image.url}
                  width={shape.width}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                <span className="absolute bottom-4 right-4 grid size-10 translate-y-2 place-items-center rounded-full border border-white/15 bg-background/65 text-primary opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Maximize2 className="size-4" />
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-background/88 p-4 backdrop-blur-xl"
          onClick={() => setActiveIndex(null)}
          role="presentation"
        >
          <button
            aria-label="Close gallery image"
            className="focus-ring absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/12 bg-white/[0.06] text-foreground transition hover:border-primary/45 hover:text-primary"
            onClick={() => setActiveIndex(null)}
            type="button"
          >
            <X className="size-5" />
          </button>
          {images.length > 1 ? (
            <>
              <button
                aria-label="Previous gallery image"
                className="focus-ring absolute left-4 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-white/[0.06] text-foreground transition hover:border-primary/45 hover:text-primary sm:grid"
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveIndex((currentIndex - 1 + images.length) % images.length)
                }}
                type="button"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                aria-label="Next gallery image"
                className="focus-ring absolute right-4 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-white/[0.06] text-foreground transition hover:border-primary/45 hover:text-primary sm:grid"
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveIndex((currentIndex + 1) % images.length)
                }}
                type="button"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}
          <motion.div
            className="relative h-[78vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] shadow-2xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(event) => event.stopPropagation()}
            transition={{ duration: 0.25 }}
          >
            <Image
              alt={activeImage.alt || title}
              className="object-contain"
              fill
              sizes="100vw"
              src={activeImage.url}
            />
          </motion.div>
          <div className="mt-4 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-muted-foreground">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      ) : null}
    </section>
  )
}
