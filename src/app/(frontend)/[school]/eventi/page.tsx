import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentSchool, getSchoolEvents } from '@/lib/school'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import type { Event } from '@/payload-types'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default async function EventsPage({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  const { docs: events } = await getSchoolEvents(school.id, 50)

  // Separate upcoming and past events
  const now = new Date()
  const upcomingEvents = events.filter((event: Event) => new Date(event.date) >= now)
  const pastEvents = events.filter((event: Event) => new Date(event.date) < now)

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Hero
        title="Eventi della scuola"
        subtitle={`Scopri tutti gli eventi e le attività di ${school.name}`}
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          {upcomingEvents.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Prossimi Eventi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event: Event) => (
                  <SpotlightCard key={event.id} className="px-0 py-0">
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
                        <div className="text-[hsl(var(--chart-2))] font-semibold text-sm mb-2">
                          {new Date(event.date).toLocaleDateString('it-IT', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                        <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
                        {event.location && <p className="text-sm mb-4">📍 {event.location}</p>}
                        <Button className="w-fit">Vedi evento</Button>
                      </div>
                    </Link>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <div className="opacity-85">
              <h2 className="text-3xl font-bold mb-8 text-muted-foreground">Eventi Passati</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.reverse().map((event: Event) => (
                  <SpotlightCard
                    key={event.id}
                    className="block rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-l-4 border-muted opacity-80"
                    bgClassName="bg-card"
                  >
                    <Link href={`/${schoolSlug}/eventi/${event.id}`}>
                      {event.cover && typeof event.cover === 'object' && event.cover.url && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={event.cover.url}
                            alt={event.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <div className="text-muted-foreground font-semibold text-sm mb-2">
                          {new Date(event.date).toLocaleDateString('it-IT', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-muted-foreground">
                          {event.title}
                        </h3>
                        {event.location && (
                          <p className="text-muted-foreground text-sm">📍 {event.location}</p>
                        )}
                      </div>
                    </Link>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}

          {upcomingEvents.length === 0 && pastEvents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Nessun evento disponibile al momento.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    return {
      title: 'Scuola non trovata',
    }
  }

  return {
    title: `Eventi - ${school.name}`,
    description: `Scopri tutti gli eventi e le attività organizzate da ${school.name}`,
  }
}
