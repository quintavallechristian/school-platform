import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import config from '@/payload.config'
import type { Event } from '@/payload-types'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'

export default async function EventiPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch all events sorted by date
  const events = await payload.find({
    collection: 'events',
    limit: 50,
    sort: 'date',
  })

  // Separate upcoming and past events
  const now = new Date()
  const upcomingEvents = events.docs.filter((event: Event) => new Date(event.date) >= now)
  const pastEvents = events.docs.filter((event: Event) => new Date(event.date) < now)

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Hero title="Eventi della scuola" />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          {upcomingEvents.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Prossimi Eventi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event: Event) => (
                  <SpotlightCard
                    key={event.id}
                    className="block bg-white rounded-xl p-8 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-l-4 border-emerald-500"
                  >
                    <Link href={`/eventi/${event.id}`}>
                      <div className="text-emerald-600 font-semibold text-sm mb-2">
                        {new Date(event.date).toLocaleDateString('it-IT', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <h3 className="text-2xl font-bold mb-4 ">{event.title}</h3>
                      {event.location && <p className=" text-sm mb-4">📍 {event.location}</p>}
                      <div className=" leading-relaxed">
                        Clicca per vedere i dettagli dell&apos;evento
                      </div>
                    </Link>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <div className="opacity-85">
              <h2 className="text-3xl font-bold mb-8 text-gray-600">Eventi Passati</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.reverse().map((event: Event) => (
                  <Link
                    key={event.id}
                    href={`/eventi/${event.id}`}
                    className="block bg-white rounded-xl p-8 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-l-4 border-gray-400 opacity-80"
                  >
                    <div className="text-gray-600 font-semibold text-sm mb-2">
                      {new Date(event.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-600">{event.title}</h3>
                    {event.location && <p className="text-gray-500 text-sm">📍 {event.location}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {upcomingEvents.length === 0 && pastEvents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Nessun evento disponibile al momento.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
