import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { isFeatureEnabled } from '@/lib/school'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.scuoleinfanzia.eu'

  // Initialize Payload
  const payload = await getPayload({ config })

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
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Fetch all active schools
  const { docs: schools } = await payload.find({
    collection: 'schools',
    where: {
      isActive: {
        equals: true,
      },
    },
    limit: 1000, // Reasonable limit for now
  })

  // Fetch all published articles
  const { docs: articles } = await payload.find({
    collection: 'articles',
    where: {
      publishedAt: {
        less_than_equal: new Date().toISOString(),
      },
    },
    limit: 5000,
    select: {
      slug: true,
      school: true,
      updatedAt: true,
      publishedAt: true,
    },
  })

  // Group articles by school ID for efficient lookup
  const articlesBySchool = articles.reduce(
    (acc, article) => {
      const schoolId = typeof article.school === 'object' ? article.school?.id : article.school
      if (schoolId) {
        if (!acc[schoolId]) {
          acc[schoolId] = []
        }
        acc[schoolId].push(article)
      }
      return acc
    },
    {} as Record<string, typeof articles>,
  )

  // Generate school routes
  const schoolRoutes = schools.flatMap((school) => {
    const schoolBaseUrl = `${baseUrl}/${school.slug}`

    const routes: MetadataRoute.Sitemap = [
      {
        url: schoolBaseUrl,
        lastModified: new Date(school.updatedAt),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
    ]

    // Add feature routes if enabled
    if (isFeatureEnabled(school, 'blog')) {
      routes.push({
        url: `${schoolBaseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })

      // Add individual articles if blog is enabled
      const schoolArticles = articlesBySchool[school.id] || []
      schoolArticles.forEach((article) => {
        routes.push({
          url: `${schoolBaseUrl}/blog/${article.slug}`,
          lastModified: new Date(article.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      })
    }
    if (isFeatureEnabled(school, 'events')) {
      routes.push({
        url: `${schoolBaseUrl}/eventi`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
    if (isFeatureEnabled(school, 'calendar')) {
      routes.push({
        url: `${schoolBaseUrl}/calendario`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
    if (isFeatureEnabled(school, 'communications')) {
      routes.push({
        url: `${schoolBaseUrl}/comunicazioni`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9, // High priority as it changes often
      })
    }
    if (isFeatureEnabled(school, 'menu')) {
      routes.push({
        url: `${schoolBaseUrl}/mensa`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
    if (isFeatureEnabled(school, 'teachers')) {
      routes.push({
        url: `${schoolBaseUrl}/insegnanti`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
      })
    }
    if (isFeatureEnabled(school, 'projects')) {
      routes.push({
        url: `${schoolBaseUrl}/progetti`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }

    // Add standard pages
    routes.push({
      url: `${schoolBaseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    })

    return routes
  })

  return [...staticPages, ...schoolRoutes]
}
