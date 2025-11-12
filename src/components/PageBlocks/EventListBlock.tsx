import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page, Event } from '@/payload-types'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Button } from '@/components/ui/button'

type EventListBlockType = Extract<NonNullable<Page['blocks']>[number], { blockType: 'eventList' }>

type Props = {
  block: EventListBlockType
  schoolId: string | number
  schoolSlug: string
}

export default async function EventListBlock({ block, schoolId, schoolSlug }: Props) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Recupera gli eventi della scuola
  const { docs: events } = await payload.find({
    collection: 'events',
    where: {
      school: {
        equals: schoolId,
      },
    },
    limit: block.limit || 6,
    sort: '-date',
  })

  if (events.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        {block.title && <h2 className="text-3xl font-bold mb-8 text-primary">{block.title}</h2>}
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-xl">📅 Nessun evento disponibile</p>
        </div>
      </div>
    )
  }

  // Filtra eventi futuri e passati se richiesto
  const now = new Date()
  let filteredEvents = events as Event[]

  if (block.filter === 'upcoming') {
    filteredEvents = events.filter((event) => new Date(event.date) >= now) as Event[]
  } else if (block.filter === 'past') {
    filteredEvents = events.filter((event) => new Date(event.date) < now) as Event[]
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        {block.title && <h2 className="text-3xl font-bold mb-8 text-primary">{block.title}</h2>}
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-xl">
            📅 Nessun evento {block.filter === 'upcoming' ? 'in programma' : 'passato'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {block.title && <h2 className="text-3xl font-bold mb-8 text-primary">{block.title}</h2>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => {
          const isPast = new Date(event.date) < now

          return (
            <SpotlightCard key={event.id} className={`px-0 py-0 ${isPast ? 'opacity-80' : ''}`}>
              <Link href={`/${schoolSlug}/eventi/${event.id}`}>
                {event.cover && typeof event.cover === 'object' && event.cover.url && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={event.cover.url}
                      alt={event.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300 rounded-t-2xl"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div
                    className={`font-semibold text-sm mb-2 ${isPast ? 'text-muted-foreground' : 'text-[hsl(var(--chart-2))]'}`}
                  >
                    {new Date(event.date).toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-4 ${isPast ? 'text-muted-foreground' : ''}`}
                  >
                    {event.title}
                  </h3>
                  {event.location && (
                    <p className={`text-sm mb-4 ${isPast ? 'text-muted-foreground' : ''}`}>
                      📍 {event.location}
                    </p>
                  )}
                  <Button className="w-fit" variant={isPast ? 'outline' : 'default'}>
                    Vedi evento
                  </Button>
                </div>
              </Link>
            </SpotlightCard>
          )
        })}
      </div>

      {block.showViewAll && (
        <div className="text-center mt-8">
          <Link href={`/${schoolSlug}/eventi`}>
            <Button variant="outline" size="lg">
              Vedi tutti gli eventi →
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
