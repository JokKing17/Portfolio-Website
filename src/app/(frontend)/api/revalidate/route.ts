import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const defaultPaths = ['/', '/about', '/projects', '/blog', '/contact']

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.REVALIDATE_SECRET
  const providedSecret = request.nextUrl.searchParams.get('secret')

  if (configuredSecret && providedSecret !== configuredSecret) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as { paths?: unknown }
  const paths = Array.isArray(body.paths) ? body.paths : defaultPaths

  paths
    .filter((path: unknown): path is string => typeof path === 'string' && path.startsWith('/'))
    .forEach((path: string) => revalidatePath(path))

  return NextResponse.json({ revalidated: true, paths })
}
