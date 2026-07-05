import type { CollectionConfig } from 'payload'
import { publicReadAuthenticatedWrite } from './access'
import { mediaRelationship, orderField, textItems } from './fields'
import { formatSlug } from './utils'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Work',
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', 'category', 'order', 'updatedAt']
  },
  access: publicReadAuthenticatedWrite,
  hooks: {
    beforeValidate: [formatSlug('title')]
  },
  versions: {
    drafts: true
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true
    },
    {
      name: 'fullDescription',
      type: 'textarea',
      required: true
    },
    mediaRelationship('coverImage', 'Cover image'),
    {
      name: 'galleryImages',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true
    },
    {
      name: 'techStack',
      type: 'array',
      fields: [
        {
          name: 'technology',
          type: 'text',
          required: true
        }
      ]
    },
    {
      name: 'category',
      type: 'text'
    },
    {
      type: 'row',
      fields: [
        {
          name: 'githubUrl',
          type: 'text'
        },
        {
          name: 'liveUrl',
          type: 'text'
        }
      ]
    },
    {
      type: 'row',
      fields: [
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false
        },
        {
          name: 'projectType',
          type: 'select',
          options: ['Client', 'Personal', 'Open Source', 'Internal', 'Research']
        }
      ]
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
      name: 'challenges',
      type: 'textarea'
    },
    {
      name: 'solution',
      type: 'textarea'
    },
    {
      name: 'results',
      type: 'textarea'
    },
    textItems('metrics', 'Result metrics', 'Metric'),
    orderField
  ]
}
