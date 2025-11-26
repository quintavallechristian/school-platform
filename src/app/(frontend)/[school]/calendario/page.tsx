import { notFound, redirect } from 'next/navigation'
import { getCurrentSchool, getSchoolCalendarDays, isFeatureEnabled } from '@/lib/school'
import { CalendarView } from '@/components/CalendarView/CalendarView'
import Hero from '@/components/Hero/Hero'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { cookies } from 'next/headers'

export default async function CalendarioPage({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  // Reindirizza alla homepage se la feature calendario è disabilitata
  if (!isFeatureEnabled(school, 'calendar')) {
    redirect(`/${schoolSlug}`)
  }

  const { docs: calendarDays } = await getSchoolCalendarDays(school.id)

  // Check if user is logged in as parent
  let isParent = false
  let userId: string | null = null
  
  const payload = await getPayloadHMR({ config })
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (token) {
    try {
      const result = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
      if (result.user && result.user.role === 'parent') {
        isParent = true
        userId = result.user.id
      }
    } catch (error) {
      // User not logged in or invalid token, just continue
    }
  }

  return (
    <>
      {/* Hero Header */}
      <Hero
        title="Calendario Scolastico"
        subtitle={`Festività, chiusure ed eventi importanti dell'anno scolastico di ${school.name}`}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Calendar */}
        {calendarDays.length > 0 ? (
          <CalendarView 
            calendarDays={calendarDays} 
            schoolSlug={schoolSlug} 
            isParent={isParent}
            userId={userId}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nessun evento in calendario al momento.</p>
          </div>
        )}
      </div>
    </>
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
    title: `Calendario Scolastico - ${school.name}`,
    description: `Consulta il calendario scolastico di ${school.name} con tutte le date importanti, vacanze ed eventi`,
  }
}
