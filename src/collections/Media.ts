import type { CollectionConfig } from 'payload'
import { publicReadAuthenticatedWrite } from './access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Library',
    useAsTitle: 'alt'
  },
  access: publicReadAuthenticatedWrite,
  upload: {
    staticDir: 'media',
    mimeTypes: [
      'image/*',
      'video/*',
      'application/pdf',
      'application/zip',
      'model/gltf-binary',
      'model/gltf+json',
      'application/octet-stream'
    ]
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      required: true
    },
    {
      name: 'caption',
      type: 'textarea'
    }
  ]
}
