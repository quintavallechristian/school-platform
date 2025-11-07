import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page as PageType } from '@/payload-types'
import Hero from '@/components/Hero/Hero'
import Link from 'next/link'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Button } from '@/components/ui/button'

export default async function PagesListPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const pagesData = await payload.find({
    collection: 'pages',
    limit: 100,
    sort: 'title',
  })

  const pages = pagesData.docs as PageType[]

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Hero title="Tutte le Pagine" subtitle="Esplora le pagine informative del nostro sito" />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {pages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <SpotlightCard key={page.id} className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{page.title}</h3>
                  {page.subtitle && <p className="text-muted-foreground mb-4">{page.subtitle}</p>}
                  <Link href={`/pagine/${page.slug}`}>
                    <Button variant="outline" className="w-full">
                      Leggi di più
                    </Button>
                  </Link>
                </SpotlightCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nessuna pagina disponibile al momento.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
