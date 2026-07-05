import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Enter at least 2 characters.').max(80),
  email: z.string().email('Enter a valid email address.'),
  subject: z.string().min(3, 'Enter a subject.').max(120),
  message: z.string().min(10, 'Tell me a little more.').max(2000)
})

export type ContactFormInput = z.infer<typeof contactSchema>
