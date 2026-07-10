import type { Field } from 'payload'

export const mediaRelationship = (name: string, label: string, required = false): Field => ({
  name,
  label,
  type: 'relationship',
  relationTo: 'media',
  required
})

export const textItems = (name: string, label: string, itemLabel = 'Item'): Field => ({
  name,
  label,
  type: 'array',
  fields: [
    {
      name: 'item',
      label: itemLabel,
      type: 'text',
      required: true
    }
  ]
})

export const socialLinks: Field = {
  name: 'socialLinks',
  label: 'Social links',
  type: 'array',
  admin: {
    initCollapsed: true
  },
  fields: [
    {
      name: 'platform',
      type: 'text',
      required: true
    },
    {
      name: 'url',
      type: 'text',
      required: true
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description:
          'Optional brand icon override, for example SiGithub or SiFacebook. Leave blank to use the Platform name automatically.'
      }
    }
  ]
}

export const orderField: Field = {
  name: 'order',
  type: 'number',
  defaultValue: 0,
  admin: {
    position: 'sidebar'
  }
}
