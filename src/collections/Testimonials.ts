import type { CollectionConfig } from 'payload'
import { publicReadAuthenticatedWrite } from './access'
import { mediaRelationship, orderField } from './fields'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'rating', 'order']
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'position',
      type: 'text'
    },
    {
      name: 'company',
      type: 'text'
    },
    {
      name: 'message',
      type: 'textarea',
      required: true
    },
    mediaRelationship('image', 'Image'),
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5
    },
    orderField
  ]
}
