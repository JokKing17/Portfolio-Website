import type { CollectionBeforeValidateHook } from 'payload'

export const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const formatSlug =
  (sourceField = 'title'): CollectionBeforeValidateHook =>
  ({ data }) => {
    if (!data) return data

    const source = typeof data[sourceField] === 'string' ? data[sourceField] : ''
    if (!data.slug && source) {
      data.slug = slugify(source)
    }

    if (typeof data.slug === 'string') {
      data.slug = slugify(data.slug)
    }

    return data
  }
