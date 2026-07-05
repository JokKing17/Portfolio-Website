import { withPayload } from '@payloadcms/next/withPayload'

const remotePatterns = [
  {
    protocol: 'https',
    hostname: '**.r2.dev'
  },
  {
    protocol: 'https',
    hostname: '**.cloudflarestorage.com'
  }
]

if (process.env.CLOUDFLARE_R2_PUBLIC_URL) {
  try {
    const publicUrl = new URL(process.env.CLOUDFLARE_R2_PUBLIC_URL)
    remotePatterns.push({
      protocol: publicUrl.protocol.replace(':', ''),
      hostname: publicUrl.hostname
    })
  } catch {}
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns
  },
  reactStrictMode: true,
  poweredByHeader: false
}

export default withPayload(nextConfig)
