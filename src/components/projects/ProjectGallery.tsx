'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, FileText, Images, Maximize2, PlayCircle, X } from 'lucide-react'
import { motion } from 'framer-motion'

type GalleryItem = {
  alt: string
  height?: number
  mimeType?: string
  url: string
  width?: number
}

type ProjectGalleryProps = {
  images: GalleryItem[]
  title?: string
}

type GalleryLayoutItem = GalleryItem & {
  index: number
  ratio: number
}

type GalleryRow = {
  height: number
  items: GalleryLayoutItem[]
}

function isVideo(item: GalleryItem) {
  return item.mimeType?.startsWith('video/') || false
}

function isPdf(item: GalleryItem) {
  return item.mimeType === 'application/pdf' || item.url.toLowerCase().endsWith('.pdf')
}

function isRenderableImage(item: GalleryItem) {
  return !isPdf(item) && (!item.mimeType || item.mimeType.startsWith('image/'))
}

function imageRatio(item: GalleryItem) {
  const width = item.width || (isPdf(item) ? 900 : isVideo(item) ? 1600 : 1200)
  const height = item.height || (isPdf(item) ? 1200 : 900)
  return Math.max(0.45, Math.min(2.4, width / height))
}

function pdfPreviewUrl(url: string) {
  return `${url}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`
}

function targetHeightForWidth(width: number) {
  if (width < 640) return 360
  if (width < 1024) return 300
  return 285
}

function heightLimitsForWidth(width: number) {
  if (width < 640) return { max: 560, min: 220 }
  if (width < 1024) return { max: 360, min: 220 }
  return { max: 330, min: 220 }
}

function buildJustifiedRows(images: GalleryItem[], containerWidth: number): GalleryRow[] {
  const safeWidth = Math.max(containerWidth, 320)
  const gap = 16
  const targetHeight = targetHeightForWidth(safeWidth)
  const { max, min } = heightLimitsForWidth(safeWidth)
  const targetRatio = safeWidth / targetHeight
  const items = images.map((image, index) => ({
    ...image,
    index,
    ratio: imageRatio(image)
  }))

  if (safeWidth < 640) {
    return items.map((item) => ({
      height: Math.max(min, Math.min(max, safeWidth / item.ratio)),
      items: [item]
    }))
  }

  const rows: GalleryRow[] = []
  let current: GalleryLayoutItem[] = []
  let ratioSum = 0

  for (const item of items) {
    current.push(item)
    ratioSum += item.ratio

    const isReady = ratioSum >= targetRatio || current.length >= (safeWidth >= 1024 ? 4 : 3)
    if (!isReady) continue

    const availableWidth = safeWidth - gap * (current.length - 1)
    rows.push({
      height: Math.max(min, Math.min(max, availableWidth / ratioSum)),
      items: current
    })

    current = []
    ratioSum = 0
  }

  if (current.length) {
    const availableWidth = safeWidth - gap * (current.length - 1)
    const naturalHeight = availableWidth / ratioSum
    rows.push({
      height: Math.max(min, Math.min(targetHeight, Math.min(max, naturalHeight))),
      items: current
    })
  }

  return rows
}

export function ProjectGallery({ images, title = 'Project gallery' }: ProjectGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeItem = activeIndex === null ? null : images[activeIndex]
  const currentIndex = activeIndex ?? 0
  const rows = useMemo(() => buildJustifiedRows(images, containerWidth), [containerWidth, images])

  useEffect(() => {
    const element = galleryRef.current
    if (!element) return

    const updateWidth = () => setContainerWidth(element.clientWidth)
    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

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
          {images.length} {images.length === 1 ? 'visual' : 'visuals'}
        </span>
      </div>

      <div className="grid gap-4" ref={galleryRef}>
        {rows.map((row, rowIndex) => (
          <div
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            key={`${rowIndex}-${row.items[0]?.url}`}
          >
            {row.items.map((image) => {
              const imageWidth = image.width || Math.round(row.height * image.ratio)
              const imageHeight = image.height || Math.round(row.height)
              const isSingleImageRow = row.items.length === 1
              const displayedWidth = Math.min(Math.round(row.height * image.ratio), containerWidth || imageWidth)

              return (
                <motion.button
                  aria-label={`Open ${image.alt || (isVideo(image) ? 'gallery video' : 'gallery visual')}`}
                  className="group overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] text-left shadow-[0_26px_90px_rgba(0,0,0,0.28)] transition duration-300 hover:border-primary/35 hover:shadow-[0_28px_100px_rgba(0,214,201,0.13)]"
                  initial={{ opacity: 0, y: 24 }}
                  key={`${image.url}-${image.index}`}
                  onClick={() => setActiveIndex(image.index)}
                  style={{
                    flex: isSingleImageRow ? '0 1 auto' : `${image.ratio} 1 0`,
                    height: row.height,
                    width: isSingleImageRow ? displayedWidth : undefined
                  }}
                  type="button"
                  viewport={{ once: true, amount: 0.2 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(image.index * 0.04, 0.22), duration: 0.5 }}
                >
                  <div className="relative flex size-full items-center justify-center bg-background/35">
                    {isVideo(image) ? (
                      <>
                        <video
                          aria-label={image.alt || 'Project gallery video'}
                          className="h-full w-full object-contain transition duration-700 group-hover:scale-[1.025]"
                          muted
                          playsInline
                          preload="metadata"
                          src={image.url}
                        />
                        <span className="absolute grid size-14 place-items-center rounded-full border border-primary/30 bg-background/70 text-primary shadow-[0_0_30px_rgba(0,214,201,0.18)] backdrop-blur transition duration-300 group-hover:scale-105 group-hover:border-primary/55">
                          <PlayCircle className="size-7" />
                        </span>
                      </>
                    ) : isRenderableImage(image) ? (
                      <Image
                        alt={image.alt}
                        className="h-full w-full object-contain transition duration-700 group-hover:scale-[1.025]"
                        height={imageHeight}
                        loading="lazy"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        src={image.url}
                        width={imageWidth}
                      />
                    ) : isPdf(image) ? (
                      <>
                        <iframe
                          aria-hidden="true"
                          className="pointer-events-none h-full w-full bg-white"
                          src={pdfPreviewUrl(image.url)}
                          tabIndex={-1}
                          title={`${image.alt || 'Project PDF'} preview`}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/55 to-transparent px-4 pb-4 pt-12">
                          <p className="line-clamp-1 text-sm font-medium text-foreground">
                            {image.alt || 'Project PDF'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="grid gap-3 text-center text-muted-foreground">
                        <FileText className="mx-auto size-10 text-primary" />
                        <span className="px-6 text-sm">{image.alt || 'Project file'}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                    <span className="absolute bottom-4 right-4 grid size-10 translate-y-2 place-items-center rounded-full border border-white/15 bg-background/65 text-primary opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <Maximize2 className="size-4" />
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>

      {activeItem ? (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-background/88 p-4 backdrop-blur-xl"
          onClick={() => setActiveIndex(null)}
          role="presentation"
        >
          <button
            aria-label="Close gallery visual"
            className="focus-ring absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/12 bg-white/[0.06] text-foreground transition hover:border-primary/45 hover:text-primary"
            onClick={() => setActiveIndex(null)}
            type="button"
          >
            <X className="size-5" />
          </button>
          {images.length > 1 ? (
            <>
              <button
                aria-label="Previous gallery visual"
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
                aria-label="Next gallery visual"
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
            {isVideo(activeItem) ? (
              <video
                aria-label={activeItem.alt || title}
                className="h-full w-full object-contain"
                controls
                playsInline
                preload="metadata"
                src={activeItem.url}
              />
            ) : isRenderableImage(activeItem) ? (
              <Image
                alt={activeItem.alt || title}
                className="object-contain"
                fill
                sizes="100vw"
                src={activeItem.url}
              />
            ) : isPdf(activeItem) ? (
              <iframe
                className="h-full w-full bg-white"
                src={activeItem.url}
                title={activeItem.alt || title}
              />
            ) : (
              <a
                className="grid size-full place-items-center p-8 text-center text-muted-foreground transition hover:text-primary"
                href={activeItem.url}
                rel="noreferrer"
                target="_blank"
              >
                <span>
                  <FileText className="mx-auto mb-4 size-12 text-primary" />
                  {activeItem.alt || 'Open project file'}
                </span>
              </a>
            )}
          </motion.div>
          <div className="mt-4 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-muted-foreground">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      ) : null}
    </section>
  )
}
