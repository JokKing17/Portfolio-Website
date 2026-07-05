import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getContactInfo } from '@/lib/payload'
import { contactSchema } from '@/lib/validations'

export const runtime = 'nodejs'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email provider is not configured.' }, { status: 500 })
  }

  const contactInfo = await getContactInfo()
  const to = process.env.CONTACT_TO_EMAIL || contactInfo?.email

  if (!to) {
    return NextResponse.json({ error: 'Recipient email is not configured.' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { email, message, name, subject } = parsed.data
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />')

  try {
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      html: `
        <div>
          <h1>${escapeHtml(subject)}</h1>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p>${safeMessage}</p>
        </div>
      `,
      replyTo: email,
      subject: `Portfolio inquiry: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      to
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact email failed', error)
    return NextResponse.json({ error: 'Message could not be sent.' }, { status: 500 })
  }
}
