import { notFound } from 'next/navigation'
import { getCurrentSchool, getSchoolCalendarDays } from '@/lib/school'
import { CalendarView } from '@/components/CalendarView/CalendarView'
import Hero from '@/components/Hero/Hero'

export default async function CalendarioPage({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  const { docs: calendarDays } = await getSchoolCalendarDays(school.id)

  return (
    <>
      {/* Hero Header */}
      <Hero
        title="Calendario Scolastico"
        subtitle={`Festività, chiusure ed eventi importanti dell'anno scolastico di ${school.name}`}
        primaryColor={school.primaryColor || undefined}
        secondaryColor={school.secondaryColor || undefined}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Avviso */}
        <div className="mb-8 rounded-lg border border-[hsl(var(--chart-5))]/30 bg-[hsl(var(--chart-5))]/10 p-4 backdrop-blur-sm">
          <p className="text-sm text-center italic text-[hsl(var(--chart-5))]">
            Si ricorda che durante l&apos;anno scolastico non saranno dati ulteriori avvisi per
            ricordare le festività.
          </p>
        </div>

        {/* Calendar */}
        {calendarDays.length > 0 ? (
          <CalendarView calendarDays={calendarDays} />
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
