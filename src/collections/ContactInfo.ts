import type { CollectionConfig } from 'payload'
import { publicReadAuthenticatedWrite } from './access'
import { socialLinks } from './fields'

export const ContactInfo: CollectionConfig = {
  slug: 'contact-info',
  labels: {
    singular: 'Contact Info',
    plural: 'Contact Info'
  },
  admin: {
    group: 'Settings',
    useAsTitle: 'email'
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true
    },
    {
      name: 'phone',
      type: 'text'
    },
    {
      name: 'location',
      type: 'text'
    },
    {
      name: 'availabilityStatus',
      type: 'text'
    },
    socialLinks
  ]
}
