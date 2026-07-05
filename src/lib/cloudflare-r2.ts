export const cloudflareR2 = {
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  bucket: process.env.CLOUDFLARE_R2_BUCKET,
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
}

export function isR2Configured() {
  return Boolean(
    cloudflareR2.accessKeyId &&
      cloudflareR2.secretAccessKey &&
      cloudflareR2.bucket &&
      cloudflareR2.endpoint &&
      cloudflareR2.publicUrl
  )
}
