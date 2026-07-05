import type { CollectionConfig } from 'payload'
import { publicReadAuthenticatedWrite } from './access'
import { mediaRelationship, socialLinks } from './fields'

export const Hero: CollectionConfig = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Hero'
  },
  admin: {
    group: 'Profile',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'updatedAt']
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'role',
      type: 'text',
      required: true
    },
    {
      name: 'headline',
      type: 'textarea',
      required: true
    },
    {
      name: 'shortBio',
      type: 'textarea',
      required: true
    },
    mediaRelationship('profileImage', 'Profile image'),
    mediaRelationship('hero3DModel', 'Hero 3D model'),
    mediaRelationship('resumeFile', 'Resume file'),
    {
      type: 'row',
      fields: [
        {
          name: 'primaryButtonText',
          type: 'text'
        },
        {
          name: 'primaryButtonLink',
          type: 'text'
        }
      ]
    },
    {
      type: 'row',
      fields: [
        {
          name: 'secondaryButtonText',
          type: 'text'
        },
        {
          name: 'secondaryButtonLink',
          type: 'text'
        }
      ]
    },
    socialLinks
  ]
}
