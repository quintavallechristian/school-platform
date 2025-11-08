import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentSchool, getSchoolEventById } from '@/lib/school'
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import GalleryView from '@/components/GalleryView/GalleryView'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

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
      <Hero
        title={event.title}
        subtitle={eventDate.toLocaleDateString('it-IT', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
        primaryColor={school.primaryColor || undefined}
        secondaryColor={school.secondaryColor || undefined}
      />

      <article className="max-w-full">
        <header className="pt-8 px-8">
          <div className="max-w-4xl mx-auto">
            <div
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                isPast
                  ? 'bg-muted/50 text-muted-foreground backdrop-blur-md'
                  : 'bg-[hsl(var(--chart-2))]/30 text-[hsl(var(--chart-2))] backdrop-blur-md'
              }`}
            >
              {isPast ? 'Evento Concluso' : 'Prossimo Evento'}
            </div>
            <div className="flex flex-col gap-4 mb-6 text-sm">
              {event.location && (
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="py-8 px-8">
          <div className="max-w-4xl mx-auto">
            {event.description ? (
              <SpotlightCard
                bgClassName="bg-card"
                className="prose prose-lg dark:prose-invert max-w-none
                [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 
                [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 
                [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 
                [&_h4]:text-xl [&_h4]:font-bold [&_h4]:mt-6 [&_h4]:mb-3 
                [&_p]:mb-6 [&_p]:leading-relaxed 
                [&_ul]:mb-6 [&_ul]:pl-8 [&_ul]:list-disc
                [&_ol]:mb-6 [&_ol]:pl-8 [&_ol]:list-decimal
                [&_li]:mb-2
                [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80
                [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:my-8 [&_blockquote]:italic 
                [&_code]:bg-muted [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-8
                [&_hr]:border-0 [&_hr]:border-t-2 [&_hr]:border-border [&_hr]:my-12"
              >
                <RichText data={event.description} />
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
