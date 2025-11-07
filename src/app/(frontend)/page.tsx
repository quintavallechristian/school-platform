import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import config from '@/payload.config'
import type { Article, Event } from '@/payload-types'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch latest articles
  const articles = await payload.find({
    collection: 'articles',
    limit: 6,
    sort: '-publishedAt',
  })

  // Fetch upcoming events
  const events = await payload.find({
    collection: 'events',
    limit: 3,
    sort: 'date',
    where: {
      date: {
        greater_than_equal: new Date().toISOString(),
      },
    },
  })

  return (
    <div className="min-h-screen">
      <Hero
        title="Scuola dell'infanzia Bruno Pizzolato"
        subtitle="Scopri le ultime notizie, eventi e storie dalla nostra comunità scolastica"
        buttons={[
          { text: 'Leggi gli Articoli', href: '#articles' },
          { text: 'Vedi gli Eventi', href: '#events', variant: 'destructive' },
        ]}
        big={true}
      />

      {/* Events Section */}
      <section id="events" className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12 ">Prossimi Eventi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.docs.length > 0 ? (
              events.docs.map((event: Event) => (
                <SpotlightCard key={event.id}>
                  <Link href={`/eventi/${event.id}`}>
                    <div className="text-emerald-600 font-semibold text-sm mb-2">
                      {new Date(event.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
                    {event.location && <p className=" text-sm mb-4">📍 {event.location}</p>}
                    <div className=" leading-relaxed">
                      Clicca per vedere i dettagli dell&apos;evento
                    </div>
                  </Link>
                </SpotlightCard>
              ))
            ) : (
              <p className="text-center  col-span-full py-8">
                Nessun evento in programma al momento.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12 ">Ultimi Articoli</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.docs.length > 0 ? (
              articles.docs.map((article: Article) => (
                <SpotlightCard key={article.id}>
                  <Link key={article.id} href={`/blog/${article.slug}`}>
                    <div className=" text-sm mb-3">
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
                    <h3 className="text-2xl font-bold mb-4 ">{article.title}</h3>
                    <div className=" leading-relaxed mb-4">
                      Leggi l&apos;articolo completo per scoprire di più...
                    </div>
                    <span className="text-emerald-600 font-semibold inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                      Leggi di più →
                    </span>
                  </Link>
                </SpotlightCard>
              ))
            ) : (
              <p className="text-center  col-span-full py-8">
                Nessun articolo disponibile al momento.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
