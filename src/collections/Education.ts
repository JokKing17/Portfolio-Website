import type { CollectionConfig } from 'payload'
import { publicReadAuthenticatedWrite } from './access'
import { orderField } from './fields'

export const Education: CollectionConfig = {
  slug: 'education',
  admin: {
    group: 'Profile',
    useAsTitle: 'degree',
    defaultColumns: ['degree', 'institute', 'order']
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    {
      name: 'degree',
      type: 'text',
      required: true
    },
    {
      name: 'institute',
      type: 'text',
      required: true
    },
    {
      name: 'location',
      type: 'text'
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date'
        },
        {
          name: 'endDate',
          type: 'date'
        }
      ]
    },
    {
      name: 'description',
      type: 'textarea'
    },
    {
      name: 'grade',
      type: 'text'
    },
    orderField
  ]
}
