import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const filename = fileURLToPath(import.meta.url)
const dirnamePath = dirname(filename)
const compat = new FlatCompat({
  baseDirectory: dirnamePath
})

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'src/types/payload-types.ts',
      'src/app/(payload)/admin/importMap.js'
    ]
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript')
]

export default config
