import type { CollectionConfig } from 'payload'
import { authenticated } from './access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    group: 'System',
    useAsTitle: 'email'
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    read: authenticated,
    update: authenticated,
    delete: authenticated
  },
  fields: [
    {
      name: 'name',
      type: 'text'
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'admin',
      options: [
        {
          label: 'Admin',
          value: 'admin'
        },
        {
          label: 'Editor',
          value: 'editor'
        }
      ]
    }
  ]
}
