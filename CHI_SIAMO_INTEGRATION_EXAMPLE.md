# Esempio: Integrare "Chi Siamo" con le Pages

Se vuoi mantenere l'URL `/chi-siamo` invece di `/pagine/chi-siamo`, puoi modificare la pagina esistente per caricare il contenuto dalla collection Pages.

## Passaggi

1. **Crea la pagina nel CMS**:
   - Vai su `/admin/collections/pages`
   - Crea una nuova pagina con slug: `chi-siamo`
   - Inserisci il contenuto

2. **Modifica il file** `/src/app/(frontend)/chi-siamo/page.tsx`:

```tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page as PageType } from '@/payload-types'
import Hero from '@/components/Hero/Hero'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ChiSiamoPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Carica la pagina "chi-siamo" dal CMS
  const pageData = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'chi-siamo',
      },
    },
    limit: 1,
  })

  const page = pageData.docs[0] as PageType | undefined

  // Se la pagina non esiste nel CMS, mostra il contenuto hard-coded
  if (!page) {
    return (
      <div className="min-h-[calc(100vh-200px)]">
        <Hero title="Scopri di più sulla nostra scuola e il nostro team di insegnanti" />

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">La Nostra Missione</h2>
              <p className="text-lg leading-relaxed mb-6">
                La nostra scuola si impegna a fornire un&apos;educazione di qualità che prepara gli
                studenti per il futuro. Crediamo nell&apos;apprendimento innovativo e
                nell&apos;inclusività.
              </p>
              <p className="text-lg leading-relaxed">
                Con un team di insegnanti dedicati e appassionati, creiamo un ambiente di
                apprendimento stimolante dove ogni studente può crescere e raggiungere il proprio
                potenziale.
              </p>
            </div>

            <SpotlightCard className="rounded-xl p-12 text-center max-w-2xl mx-auto mt-12">
              <h3 className="text-2xl font-bold mb-4">Conosci il Nostro Team</h3>
              <p className="mb-8">Scopri i nostri insegnanti e le loro competenze</p>
              <Link href="/chi-siamo/insegnanti">
                <Button>Vedi gli Insegnanti</Button>
              </Link>
            </SpotlightCard>
          </div>
        </section>
      </div>
    )
  }

  // Mostra il contenuto dal CMS
  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Hero title={page.title} subtitle={page.subtitle || undefined} />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
            {page.content && <RichText data={page.content} />}
          </article>

          {/* Mantieni il link agli insegnanti */}
          <SpotlightCard className="rounded-xl p-12 text-center max-w-2xl mx-auto mt-12">
            <h3 className="text-2xl font-bold mb-4">Conosci il Nostro Team</h3>
            <p className="mb-8">Scopri i nostri insegnanti e le loro competenze</p>
            <Link href="/chi-siamo/insegnanti">
              <Button>Vedi gli Insegnanti</Button>
            </Link>
          </SpotlightCard>
        </div>
      </section>
    </div>
  )
}
```

## Vantaggi di questo approccio

✅ Mantiene l'URL personalizzato `/chi-siamo`
✅ Permette di gestire il contenuto dal CMS
✅ Fallback al contenuto hard-coded se la pagina non esiste nel CMS
✅ Mantiene elementi custom come il link agli insegnanti

## Alternative

Se preferisci usare solo `/pagine/chi-siamo`, puoi:

1. Creare la pagina nel CMS con slug `chi-siamo`
2. Eliminare la cartella `/src/app/(frontend)/chi-siamo`
3. Aggiornare i link nella navbar a `/pagine/chi-siamo`
