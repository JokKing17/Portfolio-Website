# Dynamic Developer Portfolio

Premium dynamic developer portfolio built with Next.js 15 App Router, TypeScript, Payload CMS, MongoDB Atlas, Cloudflare R2, Framer Motion, GSAP ScrollTrigger, Lenis, React Three Fiber, Drei, React Hook Form, Zod, and Resend.

## Features

- Payload CMS admin at `/admin`
- MongoDB-backed portfolio content
- Cloudflare R2 media uploads through Payload's S3 adapter
- Dynamic home, about, projects, project detail, blog, blog detail, and contact pages
- Dynamic SEO metadata, Open Graph, Twitter cards, sitemap, robots, and Person schema
- CMS-managed hero, about, skills, projects, experience, education, achievements, certificates, testimonials, services, contact info, site settings, social links, and section ordering
- Smooth scroll, custom cursor, page loader, page transitions, magnetic buttons, Framer Motion reveals, GSAP ScrollTrigger, and 3D hero scene
- Resend-powered contact form with Zod validation

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill required values:

```env
DATABASE_URI=mongodb+srv://user:password@cluster.mongodb.net/dynamic-developer-portfolio
PAYLOAD_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
RESEND_API_KEY=
CONTACT_TO_EMAIL=
```

4. Generate Payload files after dependency install:

```bash
npm run generate:importmap
npm run generate:types
```

5. Start development:

```bash
npm run dev
```

Open `http://localhost:3000/admin` and create the first admin user.

## MongoDB Atlas

Create an Atlas cluster, add your current IP to Network Access, create a database user, and place the connection string in `DATABASE_URI`. Payload uses the MongoDB adapter configured in `src/payload.config.ts`.

## Cloudflare R2

Create an R2 bucket and an API token with read/write access. Enable a public bucket URL through `r2.dev` or a custom domain, then set:

```env
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=
CLOUDFLARE_R2_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL=https://media.yourdomain.com
```

Uploads use `@payloadcms/storage-s3` because R2 exposes an S3-compatible API in Node/Vercel environments.

## Vercel Deployment

1. Push the project to GitHub.
2. Import it in Vercel as a Next.js project.
3. Add all production environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SERVER_URL` to your Vercel production URL or custom domain.
5. Deploy.
6. Visit `/admin`, create the first user, and publish content.

Recommended build command:

```bash
npm run build
```

## Content Flow

The frontend reads Payload through the local API helpers in `src/lib/payload.ts`. Singleton-style content such as Hero, About, Contact Info, and Site Settings is modeled as Payload collections and the newest document is used. Section visibility and order are controlled by `SiteSettings.sectionOrder`.

## Useful Commands

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run generate:types
npm run generate:importmap
```
