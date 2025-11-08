import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCurrentSchool, getSchoolEventById } from '@/lib/school'
import React from 'react'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import GalleryView from '@/components/GalleryView/GalleryView'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { RichTextRenderer } from '@/components/RichTextRenderer/RichTextRenderer'

export default async function EventPage({
  params,
}: {
  params: Promise<{ school: string; id: string }>
}) {
  const { school: schoolSlug, id } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  const event = await getSchoolEventById(school.id, id)

  if (!event) {
    notFound()
  }

  const eventDate = new Date(event.date)
  const isPast = eventDate < new Date()
  const gallery = event.gallery && typeof event.gallery === 'object' ? event.gallery : null

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <article className="max-w-full">
        <header>
          <Hero
            title={event.title}
            subtitle={eventDate.toLocaleDateString('it-IT', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
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
              <Link href={`/${schoolSlug}/eventi`} className="text-primary hover:underline">
                Eventi
              </Link>
              {' / '}
              <span className="text-muted-foreground">{event.title}</span>
            </nav>

            {/* Event Status Badge */}
            <div className="mb-6">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  isPast
                    ? 'bg-muted/50 text-muted-foreground'
                    : 'bg-[hsl(var(--chart-2))]/30 text-[hsl(var(--chart-2))]'
                }`}
              >
                {isPast ? 'Evento Concluso' : 'Prossimo Evento'}
              </span>
            </div>

            {/* Event Details */}
            {event.location && (
              <div className="mb-8 p-4 rounded-xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Luogo
                    </p>
                    <p className="text-base font-semibold text-foreground">{event.location}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Cover Image (if exists) */}
            {event.cover && typeof event.cover === 'object' && event.cover.url && (
              <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-2xl mb-8">
                <Image
                  src={event.cover.url}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            {event.description ? (
              <SpotlightCard>
                <RichTextRenderer content={event.description} />
              </SpotlightCard>
            ) : (
              <p className="text-center text-muted-foreground italic py-8">
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

        <footer className="px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            <Link href={`/${schoolSlug}/eventi`}>
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4" />
                Torna agli Eventi
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
  params: Promise<{ school: string; id: string }>
}) {
  const { school: schoolSlug, id } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    return {
      title: 'Scuola non trovata',
    }
  }

  const event = await getSchoolEventById(school.id, id)

  if (!event) {
    return {
      title: 'Evento non trovato',
    }
  }

  return {
    title: `${event.title} - ${school.name}`,
    description: event.title,
    openGraph:
      event.cover && typeof event.cover === 'object' && event.cover.url
        ? {
            images: [event.cover.url],
          }
        : undefined,
  }
}
