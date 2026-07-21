import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { About } from './collections/About'
import { Achievements } from './collections/Achievements'
import { Blogs } from './collections/Blogs'
import { Certificates } from './collections/Certificates'
import { ContactInfo } from './collections/ContactInfo'
import { Education } from './collections/Education'
import { Experience } from './collections/Experience'
import { Hero } from './collections/Hero'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { SiteSettings } from './collections/SiteSettings'
import { Skills } from './collections/Skills'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const r2Enabled = Boolean(
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
    process.env.CLOUDFLARE_R2_BUCKET &&
    process.env.CLOUDFLARE_R2_ENDPOINT &&
    process.env.CLOUDFLARE_R2_PUBLIC_URL
)

const maxUploadSize = 150 * 1024 * 1024

console.log('PAYLOAD DATABASE_URI:', process.env.DATABASE_URI)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      providers: ['@payloadcms/ui/providers/UploadHandlers#UploadHandlersProvider']
    },
    meta: {
      titleSuffix: '- Dynamic Developer Portfolio'
    },
    importMap: {
      baseDir: path.resolve(dirname)
    }
  },
  collections: [
    Users,
    Media,
    Hero,
    About,
    Skills,
    Projects,
    Experience,
    Education,
    Achievements,
    Certificates,
    Blogs,
    Testimonials,
    Services,
    ContactInfo,
    SiteSettings
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://127.0.0.1/dynamic-developer-portfolio'
  }),
  editor: lexicalEditor({}),
  plugins: [
    s3Storage({
      enabled: r2Enabled,
      clientUploads: {
        access: ({ req }) => Boolean(req.user)
      },
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename: uploadedFilename, prefix }) => {
            const key = prefix ? `${prefix}/${uploadedFilename}` : uploadedFilename
            return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`
          }
        }
      },
      bucket: process.env.CLOUDFLARE_R2_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || ''
        },
        endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
        forcePathStyle: true,
        region: 'auto'
      }
    })
  ],
  upload: {
    abortOnLimit: true,
    limits: {
      fileSize: maxUploadSize
    },
    responseOnLimit: 'Upload is too large. Please keep files under 150 MB.',
    tempFileDir: 'tmp',
    uploadTimeout: 5 * 60 * 1000,
    useTempFiles: true
  },
  secret: process.env.PAYLOAD_SECRET || 'development-secret-change-before-deploy',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'types/payload-types.ts')
  }
})

