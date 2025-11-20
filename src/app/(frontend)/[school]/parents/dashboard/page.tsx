import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Media } from '@/payload-types'
import Link from 'next/link'

export default async function ParentsDashboardPage({
  params,
}: {
  params: Promise<{ school: string }>
}) {
  const { school } = await params
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

  // Fetch children associati al genitore
  const children = await payload.find({
    collection: 'children',
    where: {
      id: {
        in: user.children?.map((c) => (typeof c === 'string' ? c : c.id)) || [],
      },
    },
    depth: 2,
  })

  return (
    <div className="min-h-screen bg-background">
      <Hero
        title="Area Genitori"
        subtitle={`Benvenuto/a ${user.firstName || user.email}`}
        gradientOverlay={true}
        bottomDivider={{
          style: 'waves',
          height: 60,
          flip: true,
        }}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <span className="bg-primary/10 p-2 rounded-lg text-primary">👶</span>
            I tuoi Figli
          </h2>
          <p className="text-muted-foreground">
            Seleziona un bambino per visualizzare i suoi aggiornamenti e appuntamenti.
          </p>
        </div>

        {children.docs.length === 0 ? (
          <div className="bg-muted/30 p-12 rounded-2xl text-center border-2 border-dashed">
            <p className="text-xl text-muted-foreground font-medium">
              Nessun bambino associato al tuo account.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Contatta la scuola per associare i tuoi figli.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {children.docs.map((child) => (
              <Link
                key={child.id}
                href={`/${school}/parents/child/${child.id}`}
                className="block group"
              >
                <SpotlightCard className="h-full bg-card/50 backdrop-blur-sm border-muted/50 hover:border-primary/50 transition-colors duration-300">
                  <div className="flex flex-col items-center text-center">
                    {child.photo && typeof child.photo === 'object' ? (
                      <div className="mb-6 w-40 h-40 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500 border-4 border-background">
                        <img
                          src={child.photo.url || ''}
                          alt={child.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mb-6 w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center text-4xl shadow-inner">
                        👶
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {child.fullName}
                    </h3>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2 justify-center">
                        <span className="font-medium text-foreground">Classe:</span> {child.classroom}
                      </p>
                      <p className="flex items-center gap-2 justify-center">
                        <span className="font-medium text-foreground">Nato/a il:</span> {new Date(child.dateOfBirth).toLocaleDateString('it-IT')}
                      </p>
                    </div>

                    <div className="mt-6 w-full">
                      <span className="inline-block w-full py-2 px-4 rounded-lg bg-primary/10 text-primary font-medium text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        Visualizza Profilo →
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
