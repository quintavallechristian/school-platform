import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentSchool, getSchoolArticleBySlug, isFeatureEnabled } from '@/lib/school'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import GalleryView from '@/components/GalleryView/GalleryView'
import type { User } from '@/payload-types'
import { RichTextRenderer } from '@/components/RichTextRenderer/RichTextRenderer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { JsonLd } from '@/components/SEO/JsonLd'

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ school: string; slug: string }>
}) {
  const { school: schoolSlug, slug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  // Reindirizza alla homepage se la feature blog è disabilitata
  if (!isFeatureEnabled(school, 'blog')) {
    redirect(`/${schoolSlug}`)
  }

  const article = await getSchoolArticleBySlug(school.id, slug)

  if (!article) {
    notFound()
  }

  const author = typeof article.author === 'object' ? (article.author as User) : null
  const gallery = article.gallery && typeof article.gallery === 'object' ? article.gallery : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image:
      article.cover && typeof article.cover === 'object' && article.cover.url
        ? [article.cover.url]
        : [],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: author
      ? {
          '@type': 'Person',
          name: author.email,
        }
      : {
          '@type': 'Organization',
          name: school.name,
        },
    publisher: {
      '@type': 'Organization',
      name: school.name,
      logo: {
        '@type': 'ImageObject',
        url: school.logo && typeof school.logo === 'object' ? school.logo.url : '',
      },
    },
  }

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <JsonLd data={jsonLd} />
      <article className="max-w-full">
        <header>
          <Hero
            title={article.title}
            subtitle={
              article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString('it-IT', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : undefined
            }
            backgroundImage={article.cover}
            gradientOverlay={article.gradientOverlay || false}
          />
        </header>

        <div className="py-8 px-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm">
              <Link href={`/${schoolSlug}`} className="text-primary hover:underline">
                Home
              </Link>
              {' / '}
              <Link href={`/${schoolSlug}/blog`} className="text-primary hover:underline">
                Blog
              </Link>
              {' / '}
              <span className="text-muted-foreground">{article.title}</span>
            </nav>

            {/* Content */}
            {article.content && (
              <>
                <SpotlightCard>
                  <RichTextRenderer content={article.content} />
                </SpotlightCard>
                {/* Author info */}
                {author && (
                  <div className="mb-6 text-sm text-muted-foreground">
                    Scritto da <span className="font-semibold">{author.email}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {gallery && (
          <div className="py-8 px-8">
            <div className="max-w-4xl mx-auto">
              <GalleryView gallery={gallery} />
            </div>
          </div>
        )}

        <footer className="px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            <Link href={`/${schoolSlug}/blog`}>
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4" />
                Torna al Blog
              </Button>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ school: string; slug: string }>
}) {
  const { school: schoolSlug, slug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    return {
      title: 'Scuola non trovata',
    }
  }

  const article = await getSchoolArticleBySlug(school.id, slug)

  if (!article) {
    return {
      title: 'Articolo non trovato',
    }
  }

  const author = typeof article.author === 'object' ? (article.author as User) : null

  return {
    title: `${article.title} - ${school.name}`,
    description: `Leggi "${article.title}" su ${school.name}.`,
    openGraph: {
      title: article.title,
      description: `Leggi "${article.title}" su ${school.name}.`,
      type: 'article',
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt,
      authors: author ? [author.email] : undefined,
      images:
        article.cover && typeof article.cover === 'object' && article.cover.url
          ? [article.cover.url]
          : school.logo && typeof school.logo === 'object' && school.logo.url
            ? [school.logo.url]
            : [],
      siteName: school.name,
      locale: 'it_IT',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: `Leggi "${article.title}" su ${school.name}.`,
      images:
        article.cover && typeof article.cover === 'object' && article.cover.url
          ? [article.cover.url]
          : [],
    },
  }
}
