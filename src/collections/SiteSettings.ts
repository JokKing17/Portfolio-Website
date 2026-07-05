import type { CollectionConfig } from 'payload'
import { publicReadAuthenticatedWrite } from './access'
import { mediaRelationship } from './fields'

const sectionOptions = [
  'about',
  'skills',
  'experience',
  'education',
  'featured-projects',
  'projects',
  'achievements',
  'certificates',
  'services',
  'testimonials',
  'blog',
  'contact'
]

export const SiteSettings: CollectionConfig = {
  slug: 'site-settings',
  labels: {
    singular: 'Site Settings',
    plural: 'Site Settings'
  },
  admin: {
    group: 'Settings',
    useAsTitle: 'siteName'
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    mediaRelationship('logo', 'Logo'),
    mediaRelationship('favicon', 'Favicon'),
    {
      name: 'siteName',
      type: 'text',
      required: true
    },
    {
      name: 'siteDescription',
      type: 'textarea'
    },
    {
      name: 'defaultSeoTitle',
      type: 'text'
    },
    {
      name: 'defaultSeoDescription',
      type: 'textarea'
    },
    mediaRelationship('defaultOgImage', 'Default OG image'),
    {
      name: 'themeSettings',
      type: 'group',
      fields: [
        {
          name: 'accentColor',
          type: 'text',
          admin: {
            description: 'Hex value used for small branded accents.'
          }
        },
        {
          name: 'enableCustomCursor',
          type: 'checkbox',
          defaultValue: true
        },
        {
          name: 'enablePageLoader',
          type: 'checkbox',
          defaultValue: true
        },
        {
          name: 'enableParticles',
          type: 'checkbox',
          defaultValue: true
        }
      ]
    },
    {
      name: 'sectionOrder',
      type: 'array',
      admin: {
        description: 'Controls home page section order and visibility.'
      },
      fields: [
        {
          name: 'key',
          type: 'select',
          required: true,
          options: sectionOptions.map((value) => ({
            label: value,
            value
          }))
        },
        {
          name: 'label',
          type: 'text'
        },
        {
          name: 'visible',
          type: 'checkbox',
          defaultValue: true
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0
        }
      ]
    },
    {
      name: 'footerText',
      type: 'text'
    }
  ]
}
