import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page, Article } from '@/payload-types'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Button } from '@/components/ui/button'

type ArticleListBlockType = Extract<
  NonNullable<Page['blocks']>[number],
  { blockType: 'articleList' }
>

type Props = {
  block: ArticleListBlockType
  schoolId: string | number
  schoolSlug: string
}

export default async function ArticleListBlock({ block, schoolId, schoolSlug }: Props) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Recupera gli articoli della scuola
  const { docs: articles } = await payload.find({
    collection: 'articles',
    where: {
      school: {
        equals: schoolId,
      },
    },
    limit: block.limit || 6,
    sort: '-publishedAt',
  })

  if (articles.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        {block.title && <h2 className="text-3xl font-bold mb-8 text-primary">{block.title}</h2>}
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-xl">📭 Nessun articolo disponibile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {block.title && <h2 className="text-3xl font-bold mb-8 text-primary">{block.title}</h2>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => {
          const typedArticle = article as Article
          return (
            <SpotlightCard key={article.id} className="px-0 py-0">
              <Link href={`/${schoolSlug}/blog/${typedArticle.slug}`}>
                {typedArticle.cover &&
                  typeof typedArticle.cover === 'object' &&
                  typedArticle.cover.url && (
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={typedArticle.cover.url}
                        alt={typedArticle.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300 rounded-t-2xl"
                      />
                    </div>
                  )}

                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3 hover:text-primary transition">
                    {typedArticle.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    {typedArticle.publishedAt && (
                      <span className="flex items-center gap-1">
                        📅{' '}
                        {new Date(typedArticle.publishedAt).toLocaleDateString('it-IT', {
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
          )
        })}
      </div>

      {block.showViewAll && (
        <div className="text-center mt-8">
          <Link href={`/${schoolSlug}/blog`}>
            <Button variant="outline" size="lg">
              Vedi tutti gli articoli →
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
