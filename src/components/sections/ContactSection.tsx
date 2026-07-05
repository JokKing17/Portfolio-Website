'use client'

import { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Textarea } from '@/components/ui/textarea'
import { contactSchema, type ContactFormInput } from '@/lib/validations'
import type { ContactInfo } from '@/types/payload-types'

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
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass rounded-lg p-6">
          <div className="grid gap-4">
            {contactInfo?.email ? (
              <Link className="flex items-center gap-3 text-muted-foreground hover:text-primary" href={`mailto:${contactInfo.email}`}>
                <Mail className="size-5 text-primary" />
                {contactInfo.email}
              </Link>
            ) : null}
            {contactInfo?.phone ? (
              <Link className="flex items-center gap-3 text-muted-foreground hover:text-primary" href={`tel:${contactInfo.phone}`}>
                <Phone className="size-5 text-primary" />
                {contactInfo.phone}
              </Link>
            ) : null}
            {contactInfo?.location ? (
              <p className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="size-5 text-primary" />
                {contactInfo.location}
              </p>
            ) : null}
          </div>
          {contactInfo?.socialLinks?.length ? (
            <div className="mt-7 flex flex-wrap gap-2">
              {contactInfo.socialLinks.map((link) =>
                link.url ? (
                  <Link
                    className="rounded-md border border-white/12 bg-white/[0.04] px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                    href={link.url}
                    key={`${link.platform}-${link.url}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.platform}
                  </Link>
                ) : null
              )}
            </div>
          ) : null}
        </div>
        <form className="glass grid gap-4 rounded-lg p-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <Button disabled={isSubmitting} type="submit">
              <Send className="size-4" />
              {isSubmitting ? 'Sending' : 'Send Message'}
            </Button>
            {status === 'success' ? (
              <p className="text-sm text-primary">Message sent successfully.</p>
            ) : null}
            {status === 'error' ? (
              <p className="text-sm text-destructive">Message could not be sent.</p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  )
}
