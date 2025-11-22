import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { redirect, notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { RichTextRenderer } from '@/components/RichTextRenderer/RichTextRenderer'
import { Media } from '@/payload-types'
import Image from 'next/image'

export default async function ChildDetailPage({
  params,
}: {
  params: Promise<{ school: string; id: string }>
}) {
  const { school, id } = await params
  const payload = await getPayloadHMR({ config })

  // Get user from payload-token cookie
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    redirect(`/${school}/parents/login`)
  }

  // Verify token and get user
  let user
  try {
    const result = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    user = result.user
  } catch (error) {
    console.error('Auth error:', error)
    redirect(`/${school}/parents/login`)
  }

  // Solo genitori possono accedere
  if (!user || user.role !== 'parent') {
    redirect(`/${school}/parents/login`)
  }

  // Verifica che il genitore abbia accesso a questo bambino
  const userChildrenIds = user.children?.map((c) => (typeof c === 'string' ? c : c.id)) || []
  if (!userChildrenIds.includes(id)) {
    notFound()
  }

  // Fetch bambino con dati completi
  const child = await payload.findByID({
    collection: 'children',
    id,
    depth: 2,
  })

  if (!child) {
    notFound()
  }

  // Fetch aggiornamenti del bambino
  const updates = await payload.find({
    collection: 'child-updates',
    where: {
      child: {
        equals: id,
      },
    },
    sort: '-publishedAt',
    limit: 50,
    depth: 2,
  })

  // Fetch appuntamenti del genitore per questo bambino
  const appointments = await payload.find({
    collection: 'parent-appointments',
    where: {
      child: {
        equals: id,
      },
    },
    sort: '-date',
    limit: 20,
    depth: 2,
  })

  const heroSubtitle = `Classe: ${child.classroom}`
  return (
    <div className="min-h-screen bg-background">
      <Hero
        title={child.fullName!}
        subtitle={heroSubtitle}
        backgroundImage={child.photo as Media}
        gradientOverlay={true}
        parallax={true}
        bottomDivider={{
          style: 'waves',
          height: 60,
          flip: true,
        }}
      />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Colonna principale: Aggiornamenti */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="bg-primary/10 p-2 rounded-lg text-primary">📝</span>
                Aggiornamenti
              </h2>
              
              {updates.docs.length === 0 ? (
                <div className="bg-muted/30 p-12 rounded-2xl text-center border-2 border-dashed">
                  <p className="text-xl text-muted-foreground font-medium">Nessun aggiornamento disponibile</p>
                  <p className="text-sm text-muted-foreground mt-2">Torna a controllare presto per nuove attività!</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {updates.docs.map((update) => (
                    <SpotlightCard key={update.id} className="bg-card/50 backdrop-blur-sm border-muted/50">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{update.title}</h3>
                          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                            {new Date(update.publishedAt).toLocaleDateString('it-IT', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm
                          ${update.type === 'daily_activity' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                            update.type === 'achievement' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            update.type === 'event' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                          {update.type === 'daily_activity' ? 'Attività' :
                           update.type === 'achievement' ? 'Traguardo' :
                           update.type === 'note' ? 'Nota' : 'Evento'}
                        </span>
                      </div>
                      
                      <div className="mb-6">
                        <RichTextRenderer content={update.content} />
                      </div>

                      {update.photos && Array.isArray(update.photos) && update.photos.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                          {update.photos.map((photo, index) => {
                            if (typeof photo === 'object' && photo.url) {
                              return (
                                <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
                                  <Image
                                    src={photo.url}
                                    alt={`Foto ${index + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                              )
                            }
                            return null
                          })}
                        </div>
                      )}
                    </SpotlightCard>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Appuntamenti */}
          <div className="space-y-8">
            <div className="sticky top-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="bg-primary/10 p-2 rounded-lg text-primary">📅</span>
                Prossimi Appuntamenti
              </h2>
              
              {appointments.docs.length === 0 ? (
                <div className="bg-muted/30 p-8 rounded-2xl text-center border-2 border-dashed">
                  <p className="text-muted-foreground font-medium">Nessun appuntamento</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.docs
                    .filter((apt) => apt.status === 'scheduled')
                    .map((appointment) => (
                      <div key={appointment.id} className="group relative overflow-hidden rounded-xl bg-card border p-5 hover:shadow-lg transition-all duration-300">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary group-hover:w-2 transition-all duration-300" />
                        <div className="pl-3">
                          <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{appointment.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <span>🗓</span>
                            <span>
                              {new Date(appointment.date).toLocaleDateString('it-IT', {
                                day: 'numeric',
                                month: 'long',
                              })}
                            </span>
                            <span className="mx-1">•</span>
                            <span>⏰</span>
                            <span>
                              {new Date(appointment.date).toLocaleTimeString('it-IT', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          {appointment.location && (
                            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                              <span>📍</span> {appointment.location}
                            </p>
                          )}
                          {appointment.description && (
                            <p className="text-sm mt-3 pt-3 border-t text-muted-foreground/80 italic">
                              {appointment.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
