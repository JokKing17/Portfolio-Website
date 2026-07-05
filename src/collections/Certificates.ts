import type { CollectionConfig } from 'payload'
import { publicReadAuthenticatedWrite } from './access'
import { mediaRelationship, orderField } from './fields'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  admin: {
    group: 'Recognition',
    useAsTitle: 'title',
    defaultColumns: ['title', 'organization', 'issueDate', 'order']
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'organization',
      type: 'text',
      required: true
    },
    mediaRelationship('certificateImage', 'Certificate image'),
    mediaRelationship('certificateFile', 'Certificate file'),
    {
      name: 'issueDate',
      type: 'date'
    },
    {
      name: 'credentialUrl',
      type: 'text'
    },
    orderField
  ]
}
