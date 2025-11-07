import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import type { Event } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import GalleryView from '@/components/GalleryView/GalleryView'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function EventoPage({ params }: Props) {
  const { id } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let event: Event

  try {
    event = await payload.findByID({
      collection: 'events',
      id: id,
    })
  } catch (_error) {
    notFound()
  }

  const eventDate = new Date(event.date)
  const isPast = eventDate < new Date()
  const gallery = event.gallery && typeof event.gallery === 'object' ? event.gallery : null

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <article className="max-w-full">
        <header className="pt-16 px-8">
          <div className="max-w-4xl mx-auto">
            <div
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                isPast ? 'bg-gray-500/30 backdrop-blur-md' : 'bg-emerald-500/30 backdrop-blur-md'
              }`}
            >
              {isPast ? 'Evento Concluso' : 'Prossimo Evento'}
            </div>
            <div className="flex flex-col gap-4 mb-6 text-sm opacity-90">
              <div className="flex items-center gap-3">
                <span className="text-xl">📅</span>
                <time dateTime={event.date}>
                  {eventDate.toLocaleDateString('it-IT', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>
              {event.location && (
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <span>{event.location}</span>
                </div>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{event.title}</h1>
          </div>
        </header>

        <div className="py-16 px-8">
          <div className="max-w-4xl mx-auto">
            {event.description ? (
              <SpotlightCard
                className="prose prose-lg max-w-none
                [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 
                [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 
                [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 
                [&_h4]:text-xl [&_h4]:font-bold [&_h4]:mt-6 [&_h4]:mb-3 
                [&_p]:mb-6 [&_p]:leading-relaxed 
                [&_ul]:mb-6 [&_ul]:pl-8 [&_ul]:list-disc
                [&_ol]:mb-6 [&_ol]:pl-8 [&_ol]:list-decimal
                [&_li]:mb-2
                [&_a]:text-emerald-600 [&_a]:underline hover:[&_a]:text-emerald-700
                [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-6 [&_blockquote]:my-8 [&_blockquote]:italic 
                [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-8
                [&_hr]:border-0 [&_hr]:border-t-2 [&_hr]:border-gray-200 [&_hr]:my-12"
              >
                <RichText data={event.description} />
              </SpotlightCard>
            ) : (
              <p className="text-center opacity-50 italic py-8">
                Nessuna descrizione disponibile per questo evento.
              </p>
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

        <footer>
          <div className="max-w-4xl mx-auto">
            <Link
              href="/eventi"
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-4 transition-all"
            >
              ← Torna agli Eventi
            </Link>
          </div>
        </footer>
      </article>
    </div>
  )
}
