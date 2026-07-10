'use client'

import { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Clock3, LoaderCircle, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { Textarea } from '@/components/ui/textarea'
import { contactSchema, type ContactFormInput } from '@/lib/validations'
import type { ContactInfo } from '@/types/payload-types'

const preferredServices = [
  'AI Development',
  'Mobile Apps',
  'FastAPI',
  'RAG Systems',
  'Agentic AI',
  'API Integration'
]

export function ContactSection({
  contactInfo,
  heading
}: {
  contactInfo?: ContactInfo | null
  heading?: string
}) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (values: ContactFormInput) => {
    setStatus('idle')
    const response = await fetch('/api/contact', {
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    if (!response.ok) {
      setStatus('error')
      return
    }

    setStatus('success')
    reset()
  }

  return (
    <section className="section-shell container" id="contact">
      <SectionHeading
        eyebrow="Contact"
        title={heading || 'Contact'}
        description={contactInfo?.availabilityStatus || undefined}
      />
      <div className="grid items-stretch gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="polished-card flex h-full flex-col rounded-2xl p-6 sm:p-7">
          <div className="grid gap-3">
            {contactInfo?.email ? (
              <Link className="group flex items-center gap-3 rounded-xl px-2 py-2 text-muted-foreground transition duration-300 hover:bg-white/[0.04] hover:text-primary" href={`mailto:${contactInfo.email}`}>
                <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/[0.08] text-primary transition group-hover:border-primary/35 group-hover:bg-primary/[0.12]">
                  <Mail className="size-4" />
                </span>
                <span className="truncate text-sm sm:text-base">{contactInfo.email}</span>
              </Link>
            ) : null}
            {contactInfo?.phone ? (
              <Link className="group flex items-center gap-3 rounded-xl px-2 py-2 text-muted-foreground transition duration-300 hover:bg-white/[0.04] hover:text-primary" href={`tel:${contactInfo.phone}`}>
                <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/[0.08] text-primary transition group-hover:border-primary/35 group-hover:bg-primary/[0.12]">
                  <Phone className="size-4" />
                </span>
                <span className="text-sm sm:text-base">{contactInfo.phone}</span>
              </Link>
            ) : null}
            {contactInfo?.location ? (
              <p className="flex items-center gap-3 px-2 py-2 text-muted-foreground">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/[0.08] text-primary">
                  <MapPin className="size-4" />
                </span>
                <span className="text-sm sm:text-base">{contactInfo.location}</span>
              </p>
            ) : null}
          </div>

          <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/[0.13] to-transparent" />

          {contactInfo?.availabilityStatus ? (
            <div className="rounded-xl border border-primary/20 bg-primary/[0.065] p-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
                </span>
                <p className="text-sm font-semibold text-foreground">{contactInfo.availabilityStatus}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span>Freelance</span>
                <span>AI projects</span>
                <span>Remote collaboration</span>
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.035] px-4 py-3.5">
            <Clock3 className="size-4 shrink-0 text-secondary" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80">Response time</p>
              <p className="mt-1 text-sm text-muted-foreground">Usually replies within 24 hours.</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80">Preferred services</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {preferredServices.map((service) => (
                <span className="rounded-full border border-white/[0.11] bg-white/[0.045] px-3 py-1.5 text-xs text-muted-foreground" key={service}>
                  {service}
                </span>
              ))}
            </div>
          </div>

          {contactInfo?.socialLinks?.length ? (
            <div className="mt-auto flex flex-wrap gap-2.5 pt-7">
              {contactInfo.socialLinks.map((link) =>
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
          ) : null}
        </div>
        <form className="polished-card grid h-full gap-5 rounded-2xl p-6 sm:p-7" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              Name
              <Input placeholder="Your name" {...register('name')} />
              {errors.name ? <span className="text-xs text-destructive">{errors.name.message}</span> : null}
            </label>
            <label className="grid gap-2 text-sm">
              Email
              <Input placeholder="you@example.com" type="email" {...register('email')} />
              {errors.email ? <span className="text-xs text-destructive">{errors.email.message}</span> : null}
            </label>
          </div>
          <label className="grid gap-2 text-sm">
            Subject
            <Input placeholder="Project inquiry" {...register('subject')} />
            {errors.subject ? <span className="text-xs text-destructive">{errors.subject.message}</span> : null}
          </label>
          <label className="grid gap-2 text-sm">
            Message
            <Textarea placeholder="Tell me about your project..." {...register('message')} />
            {errors.message ? <span className="text-xs text-destructive">{errors.message.message}</span> : null}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button className="transition-transform hover:-translate-y-0.5 active:translate-y-0" disabled={isSubmitting} type="submit">
              {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
            {status === 'success' ? (
              <p className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/[0.08] px-3 py-2 text-sm text-primary">
                <CheckCircle2 className="size-4" />
                Message sent successfully.
              </p>
            ) : null}
            {status === 'error' ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/[0.08] px-3 py-2 text-sm text-destructive">
                Message could not be sent. Please try again.
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  )
}
