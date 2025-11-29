import { notFound, redirect } from 'next/navigation'
import { getCurrentSchool, getSchoolCalendarDays, isFeatureEnabled } from '@/lib/school'
import { CalendarView } from '@/components/CalendarView/CalendarView'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import EmptyArea from '@/components/EmptyArea/EmptyArea'

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

  return (
    <>
      {/* Hero Header */}
      <Hero
        title="Calendario Scolastico"
        subtitle={`Festività, chiusure ed eventi importanti dell'anno scolastico`}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Calendar */}
        {calendarDays.length > 0 ? (
          <CalendarView calendarDays={calendarDays} schoolSlug={schoolSlug} />
        ) : (
          <SpotlightCard className="max-w-4xl mx-auto -mt-16 px-0 py-0">
            <EmptyArea title="Nessun evento in calendario al momento." message="" />
          </SpotlightCard>
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
    title: `Calendario Scolastico`,
    description: `Consulta il calendario scolastico con tutte le date importanti, vacanze ed eventi`,
  }
}
