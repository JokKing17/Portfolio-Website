import type { CollectionConfig } from 'payload'
import { publicReadAuthenticatedWrite } from './access'
import { mediaRelationship, orderField } from './fields'

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    group: 'Profile',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'level', 'order']
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'category',
      type: 'text',
      required: true
    },
    mediaRelationship('icon', 'Icon'),
    {
      name: 'level',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 80
    },
    {
      name: 'description',
      type: 'textarea'
    },
    orderField
  ]
}
