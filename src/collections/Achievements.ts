import type { CollectionConfig } from 'payload'
import { publicReadAuthenticatedWrite } from './access'
import { mediaRelationship, orderField } from './fields'

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  admin: {
    group: 'Recognition',
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'order']
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
    mediaRelationship('image', 'Image'),
    {
      name: 'date',
      type: 'date'
    },
    {
      name: 'relatedProject',
      type: 'relationship',
      relationTo: 'projects'
    },
    orderField
  ]
}
