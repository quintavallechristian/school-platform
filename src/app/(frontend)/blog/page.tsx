import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import config from '@/payload.config'
import type { Article } from '@/payload-types'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'

export default async function BlogPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const articles = await payload.find({
    collection: 'articles',
    limit: 20,
    sort: '-publishedAt',
  })

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Hero title="Il blog della scuola" />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          {articles.docs.length > 0 ? (
            <div className="space-y-8">
              {articles.docs.map((article: Article) => (
                <SpotlightCard key={article.id}>
                  <Link key={article.id} href={`/blog/${article.slug}`}>
                    <div className="text-gray-500 text-sm mb-4 font-medium">
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
                    <h2 className="text-3xl font-bold mb-4 ">{article.title}</h2>
                    <div className="leading-relaxed mb-6">
                      Leggi l&apos;articolo completo per scoprire di più...
                    </div>
                    <span className="text-emerald-600 font-semibold inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                      Leggi tutto →
                    </span>
                  </Link>
                </SpotlightCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Nessun articolo disponibile al momento.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
