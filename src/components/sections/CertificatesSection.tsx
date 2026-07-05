'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { formatDate, getMedia, getMediaUrl } from '@/lib/utils'
import type { Certificate } from '@/types/payload-types'

export function CertificatesSection({
  certificates,
  heading
}: {
  certificates: Certificate[]
  heading?: string
}) {
  return (
    <section className="section-shell container" id="certificates">
      <SectionHeading eyebrow="Credentials" title={heading || 'Certificates'} />
      {!certificates.length ? (
        <EmptyState title="No certificates published yet." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => {
            const image = getMedia(certificate.certificateImage)
            const imageUrl = getMediaUrl(certificate.certificateImage)
            const fileUrl = getMediaUrl(certificate.certificateFile)

            return (
              <article className="glass rounded-lg p-5" key={certificate.id}>
                <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-md border border-white/12 bg-white/[0.04]">
                  {imageUrl ? (
                    <Image
                      alt={image?.alt || certificate.title || 'Certificate image'}
                      className="object-cover"
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      src={imageUrl}
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-aurora">
                      <BadgeCheck className="size-10 text-primary" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{certificate.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{certificate.organization}</p>
                {certificate.issueDate ? (
                  <p className="mt-2 text-sm text-secondary">{formatDate(certificate.issueDate)}</p>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  {certificate.credentialUrl ? (
                    <Button asChild size="sm" variant="outline">
                      <Link href={certificate.credentialUrl} rel="noreferrer" target="_blank">
                        Verify
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </Button>
                  ) : null}
                  {fileUrl ? (
                    <Button asChild size="sm" variant="secondary">
                      <Link href={fileUrl} rel="noreferrer" target="_blank">
                        File
                        <Download className="size-3.5" />
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
