import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCurrentSchool, getSchoolArticles, isFeatureEnabled } from '@/lib/school'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'

export default async function BlogPage({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  // Reindirizza alla homepage se la feature blog è disabilitata
  if (!isFeatureEnabled(school, 'blog')) {
    redirect(`/${schoolSlug}`)
  }

  const { docs: articles } = await getSchoolArticles(school.id, 50)

  return (
    <div className="min-h-screen">
      <Hero
        title="Blog & Notizie"
        subtitle={`Tutte le notizie e gli aggiornamenti di ${school.name}`}
      />
      <Breadcrumbs />

      <div className="container mx-auto px-4 py-12">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <SpotlightCard key={article.id} className="px-0 py-0">
                <Link href={`/${schoolSlug}/blog/${article.slug}`}>
                  {article.cover && typeof article.cover === 'object' && article.cover.url && (
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={article.cover.url}
                        alt={article.cover.alt || article.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300 rounded-t-2xl"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-3 hover:text-primary transition">
                      {article.title}
                    </h2>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {article.publishedAt && (
                        <span className="flex items-center gap-1">
                          📅{' '}
                          {new Date(article.publishedAt).toLocaleDateString('it-IT', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>

                    <Button>Leggi l&apos;articolo →</Button>
                  </div>
                </Link>
              </SpotlightCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground mb-4">📭 Nessun articolo pubblicato</p>
            <p className="text-muted-foreground">Torna presto per leggere le nostre notizie!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    return {
      title: 'Scuola non trovata',
    }
  }

  return {
    title: `Blog & Notizie - ${school.name}`,
    description: `Leggi tutte le notizie e gli aggiornamenti di ${school.name}`,
  }
}
