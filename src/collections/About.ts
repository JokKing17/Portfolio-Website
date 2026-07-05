import type { CollectionConfig } from 'payload'
import { publicReadAuthenticatedWrite } from './access'
import { mediaRelationship, textItems } from './fields'

export const About: CollectionConfig = {
  slug: 'about',
  labels: {
    singular: 'About',
    plural: 'About'
  },
  admin: {
    group: 'Profile',
    useAsTitle: 'title'
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      required: true
    },
    mediaRelationship('profileImage', 'Profile image'),
    textItems('highlights', 'Highlights', 'Highlight'),
    {
      type: 'row',
      fields: [
        {
          name: 'yearsOfExperience',
          type: 'number',
          min: 0,
          defaultValue: 0
        },
        {
          name: 'totalProjects',
          type: 'number',
          min: 0,
          defaultValue: 0
        },
        {
          name: 'totalClients',
          type: 'number',
          min: 0,
          defaultValue: 0
        }
      ]
    },
    {
      name: 'location',
      type: 'text'
    }
  ]
}
