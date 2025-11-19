import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getCurrentSchool,
  getSchoolArticles,
  getSchoolEvents,
  getSchoolCommunications,
  getSchoolHomepage,
  isFeatureEnabled,
} from '@/lib/school'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Button } from '@/components/ui/button'
import { CommunicationsList } from '@/components/CommunicationsList/CommunicationsList'
import PageBlocks from '@/components/PageBlocks/PageBlocks'
import type { Homepage as HomepageType } from '@/payload-types'
import type { ShapeDividerStyle } from '@/components/ShapeDivider/ShapeDivider'

type PageProps = {
  params: Promise<{ school: string }>
}
export default async function SchoolHomePage({ params }: PageProps) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  const homepage = await getSchoolHomepage(school.id)

  if (homepage) {
    const typedPage = homepage as HomepageType

    const shouldShowDefaultHero =
      typedPage.heroSettings?.showHero === true || typedPage.heroSettings?.showHero === undefined
    const heroFullHeight = typedPage.heroSettings?.fullHeight ?? false

    const bottomDivider =
      typedPage.heroSettings?.bottomDivider?.enabled && typedPage.heroSettings?.bottomDivider?.style
        ? {
            style: typedPage.heroSettings.bottomDivider.style as ShapeDividerStyle,
            height: typedPage.heroSettings.bottomDivider.height || undefined,
            flip: typedPage.heroSettings.bottomDivider.flip || undefined,
            invert: typedPage.heroSettings.bottomDivider.invert || undefined,
          }
        : undefined

    return (
      <div className="min-h-[calc(100vh-200px)]">
        {shouldShowDefaultHero && (
          <Hero
            title={typedPage.heroSettings?.title || 'Home Page'}
            subtitle={typedPage.heroSettings?.subtitle || undefined}
            big={heroFullHeight}
            backgroundImage={typedPage.heroSettings?.backgroundImage || undefined}
            parallax={typedPage.heroSettings?.parallax || false}
            gradientOverlay={typedPage.heroSettings?.gradientOverlay || false}
            bottomDivider={bottomDivider}
          />
        )}{' '}
        <section>
          <PageBlocks blocks={typedPage.blocks} schoolId={school.id} schoolSlug={schoolSlug} />
        </section>
      </div>
    )
  }
  const showEvents = isFeatureEnabled(school, 'events')
  const showArticles = isFeatureEnabled(school, 'blog')
  const showCommunications = isFeatureEnabled(school, 'communications')

  const [articles, events, communications] = await Promise.all([
    showArticles
      ? getSchoolArticles(school.id, 3)
      : Promise.resolve({
          docs: [],
          totalDocs: 0,
          limit: 0,
          totalPages: 0,
          page: 1,
          pagingCounter: 1,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null,
        }),
    showEvents
      ? getSchoolEvents(school.id, 3)
      : Promise.resolve({
          docs: [],
          totalDocs: 0,
          limit: 0,
          totalPages: 0,
          page: 1,
          pagingCounter: 1,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null,
        }),
    showCommunications
      ? getSchoolCommunications(school.id, ['high', 'urgent'])
      : Promise.resolve({
          docs: [],
          totalDocs: 0,
          limit: 0,
          totalPages: 0,
          page: 1,
          pagingCounter: 1,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null,
        }),
  ])

  return (
    <div className="min-h-screen">
      <Hero
        title={school.name}
        subtitle="Scopri le ultime notizie, eventi e storie dalla nostra comunità scolastica"
        buttons={[
          { text: 'Leggi gli Articoli', href: '#articles' },
          { text: 'Vedi gli Eventi', href: '#events', variant: 'outline' },
        ]}
        big={true}
      />

      {/* Comunicazioni urgenti */}
      {showCommunications && communications.docs.length > 0 && (
        <section className="py-12 bg-[hsl(var(--chart-5))]/10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Comunicazioni Importanti</h2>

            {communications.docs.length > 0 && (
              <CommunicationsList communications={communications.docs} schoolSlug={schoolSlug} />
            )}

            <div className="mt-6 text-center">
              <Link href={`/${schoolSlug}/comunicazioni`}>
                <Button>Vedi tutte le comunicazioni</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      {showEvents && (
        <section id="events" className="py-16">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary">Prossimi Eventi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.docs.length > 0 ? (
                events.docs.map((event) => (
                  <SpotlightCard key={event.id}>
                    <Link href={`/${schoolSlug}/eventi/${event.id}`}>
                      <div className="text-emerald-600 font-semibold text-sm mb-2">
                        {new Date(event.date).toLocaleDateString('it-IT', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
                      {event.location && <p className="text-sm mb-4">📍 {event.location}</p>}
                      <div className="leading-relaxed">
                        Clicca per vedere i dettagli dell&apos;evento
                      </div>
                    </Link>
                  </SpotlightCard>
                ))
              ) : (
                <p className="text-center col-span-full py-8">
                  Nessun evento in programma al momento.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Articles Section */}
      {showArticles && (
        <section id="articles" className="py-16">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-center mb-12">Ultimi Articoli</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.docs.length > 0 ? (
                articles.docs.map((article) => (
                  <SpotlightCard key={article.id}>
                    <Link href={`/${schoolSlug}/blog/${article.slug}`}>
                      <div className="text-sm mb-3">
                        {article.publishedAt && (
                          <time dateTime={article.publishedAt}>
                            {new Date(article.publishedAt).toLocaleDateString('it-IT', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </time>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{article.title}</h3>
                      <div className="leading-relaxed mb-4">
                        Leggi l&apos;articolo completo per scoprire di più...
                      </div>
                      <span className="text-emerald-600 font-semibold inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                        Leggi di più →
                      </span>
                    </Link>
                  </SpotlightCard>
                ))
              ) : (
                <p className="text-center col-span-full py-8">
                  Nessun articolo disponibile al momento.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
