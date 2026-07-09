import { PutBucketCorsCommand, S3Client } from '@aws-sdk/client-s3'
import { existsSync, readFileSync } from 'node:fs'

function loadEnvFile(path) {
  if (!existsSync(path)) return

  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    let value = trimmed.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    process.env[key] ||= value
  }
}

function requiredEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

loadEnvFile('.env.local')
loadEnvFile('.env')

const allowedOrigins = (process.env.R2_CORS_ALLOWED_ORIGINS || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const bucket = requiredEnv('CLOUDFLARE_R2_BUCKET')

const client = new S3Client({
  credentials: {
    accessKeyId: requiredEnv('CLOUDFLARE_R2_ACCESS_KEY_ID'),
    secretAccessKey: requiredEnv('CLOUDFLARE_R2_SECRET_ACCESS_KEY')
  },
  endpoint: requiredEnv('CLOUDFLARE_R2_ENDPOINT'),
  forcePathStyle: true,
  region: 'auto'
})

await client.send(
  new PutBucketCorsCommand({
    Bucket: bucket,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ['*'],
          AllowedMethods: ['GET', 'HEAD', 'PUT'],
          AllowedOrigins: allowedOrigins,
          ExposeHeaders: ['ETag'],
          MaxAgeSeconds: 3600
        }
      ]
    }
  })
)

console.log(`Updated CORS for R2 bucket "${bucket}".`)
console.log(`Allowed origins: ${allowedOrigins.join(', ')}`)
