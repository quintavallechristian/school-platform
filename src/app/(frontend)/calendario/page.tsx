import { getPayload } from 'payload'
import config from '@payload-config'
import { CalendarView } from '@/components/CalendarView/CalendarView'
import Hero from '@/components/Hero/Hero'

export default async function CalendarioPage() {
  const payload = await getPayload({ config })

  const { docs: calendarDays } = await payload.find({
    collection: 'calendar-days',
    limit: 1000,
    sort: 'startDate',
  })

  return (
    <>
      {/* Hero Header */}
      <Hero
        title="Calendario Scolastico"
        subtitle="Festività, chiusure ed eventi importanti dell'anno scolastico"
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
