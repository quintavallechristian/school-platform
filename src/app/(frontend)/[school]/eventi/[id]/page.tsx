import { notFound, redirect } from 'next/navigation'
import { getCurrentSchool, getSchoolEventById, isFeatureEnabled } from '@/lib/school'
import React from 'react'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import GalleryView from '@/components/GalleryView/GalleryView'
import { RichTextRenderer } from '@/components/RichTextRenderer/RichTextRenderer'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'

import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { EventBooking } from '@/components/Events/EventBooking'

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

  // Reindirizza alla homepage se la feature eventi è disabilitata
  if (!isFeatureEnabled(school, 'events')) {
    redirect(`/${schoolSlug}`)
  }

  const event = await getSchoolEventById(school.id, id)

  if (!event) {
    notFound()
  }

  const eventDate = new Date(event.date)
  const isPast = eventDate < new Date()
  const gallery = event.gallery && typeof event.gallery === 'object' ? event.gallery : null

  // Check if user is logged in as parent
  let isParent = false
  let userId: string | null = null
  let existingBooking = null

  const payload = await getPayloadHMR({ config })
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (token) {
    try {
      const result = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
      if (result.user) {
        userId = result.user.id
        isParent = result.user.role === 'parent'

        if (isParent) {
          // Check for existing booking
          const bookings = await payload.find({
            collection: 'parent-appointments',
            where: {
              and: [
                {
                  event: {
                    equals: event.id,
                  },
                },
                {
                  parent: {
                    equals: userId,
                  },
                },
                {
                  status: {
                    in: ['pending', 'confirmed'],
                  },
                },
              ],
            },
          })

          if (bookings.docs.length > 0) {
            existingBooking = {
              id: bookings.docs[0].id,
              status: bookings.docs[0].status,
              timeSlot: bookings.docs[0].timeSlot,
            }
          }
        }
      }
    } catch (_error) {
      // User not logged in or invalid token
    }
  }

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
            backgroundImage={event.cover}
            gradientOverlay={event.gradientOverlay || false}
          />
        </header>

        <Breadcrumbs />

        <div className="py-8 px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Status Badge */}
              <div>
                <span
                  className={`inline-block py-2 rounded-full text-sm font-semibold ${
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
                <div className="p-4 rounded-xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-sm">
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

              {/* Booking Component */}
              {event.isBookable && !isPast && (
                <EventBooking
                  event={event}
                  isParent={isParent}
                  userId={userId}
                  existingBooking={existingBooking}
                />
              )}
            </div>
          </div>
        </div>

        {gallery && (
          <div className="py-8 px-8">
            <div className="max-w-4xl mx-auto">
              <GalleryView gallery={gallery} />
            </div>
          </div>
        )}
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
