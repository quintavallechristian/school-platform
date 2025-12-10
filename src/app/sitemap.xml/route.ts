import { getPayload } from 'payload'
import config from '@/payload.config'
import { isFeatureEnabled } from '@/lib/school'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.scuoleinfanzia.eu'
  const payload = await getPayload({ config })

  const urls: string[] = []

  // Static pages
  const staticPages = [
    '',
    '/chi-siamo',
    '/contatti',
    '/faq',
    '/login',
    '/register',
    '/privacy-policy',
    '/cookie-policy',
    '/tos',
  ]
  urls.push(...staticPages.map((route) => `${baseUrl}${route}`))

  // Fetch schools
  const { docs: schools } = await payload.find({
    collection: 'schools',
    where: { isActive: { equals: true } },
    limit: 2000,
  })

  // Fetch articles
  const { docs: articles } = await payload.find({
    collection: 'articles',
    where: { publishedAt: { less_than_equal: new Date().toISOString() } },
    limit: 5000,
    select: { slug: true, school: true },
  })

  const articlesBySchool = articles.reduce(
    (acc, article) => {
      const schoolId = typeof article.school === 'object' ? article.school?.id : article.school

      if (typeof schoolId === 'string') {
        if (!acc[schoolId]) acc[schoolId] = []
        acc[schoolId].push(article)
      }

      return acc
    },
    {} as Record<string, typeof articles>,
  )

  // School routes
  for (const school of schools) {
    const schoolBase = `${baseUrl}/${school.slug}`
    urls.push(schoolBase)

    if (isFeatureEnabled(school, 'blog')) {
      urls.push(`${schoolBase}/blog`)
      for (const a of articlesBySchool[school.id] || []) {
        urls.push(`${schoolBase}/blog/${a.slug}`)
      }
    }

    if (isFeatureEnabled(school, 'events')) urls.push(`${schoolBase}/eventi`)

    if (isFeatureEnabled(school, 'calendar')) urls.push(`${schoolBase}/calendario`)

    if (isFeatureEnabled(school, 'communications')) urls.push(`${schoolBase}/comunicazioni`)

    if (isFeatureEnabled(school, 'menu')) urls.push(`${schoolBase}/mensa`)

    if (isFeatureEnabled(school, 'teachers')) urls.push(`${schoolBase}/insegnanti`)

    if (isFeatureEnabled(school, 'projects')) urls.push(`${schoolBase}/progetti`)

    urls.push(`${schoolBase}/privacy-policy`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
  </url>`,
  )
  .join('\n')}
</urlset>`

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400',
    },
  })
}
