import type { CollectionConfig } from 'payload'
import { publicReadAuthenticatedWrite } from './access'
import { mediaRelationship, orderField, textItems } from './fields'

export const Experience: CollectionConfig = {
  slug: 'experience',
  admin: {
    group: 'Profile',
    useAsTitle: 'company',
    defaultColumns: ['company', 'position', 'currentlyWorking', 'order']
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    {
      name: 'company',
      type: 'text',
      required: true
    },
    {
      name: 'position',
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
          type: 'date',
          required: true
        },
        {
          name: 'endDate',
          type: 'date'
        },
        {
          name: 'currentlyWorking',
          type: 'checkbox',
          defaultValue: false
        }
      ]
    },
    {
      name: 'description',
      type: 'textarea'
    },
    textItems('responsibilities', 'Responsibilities', 'Responsibility'),
    textItems('technologies', 'Technologies', 'Technology'),
    mediaRelationship('companyLogo', 'Company logo'),
    orderField
  ]
}
