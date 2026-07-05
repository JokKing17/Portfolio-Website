import type { CollectionConfig } from 'payload'
import { publicReadAuthenticatedWrite } from './access'
import { mediaRelationship } from './fields'
import { formatSlug } from './utils'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', 'publishedDate', 'updatedAt']
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
      name: 'excerpt',
      type: 'textarea',
      required: true
    },
    {
      name: 'content',
      type: 'richText',
      required: true
    },
    mediaRelationship('coverImage', 'Cover image'),
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true
        }
      ]
    },
    {
      type: 'row',
      fields: [
        {
          name: 'publishedDate',
          type: 'date',
          required: true
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false
        }
      ]
    },
    {
      name: 'seoTitle',
      type: 'text'
    },
    {
      name: 'seoDescription',
      type: 'textarea'
    }
  ]
}
