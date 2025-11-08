import { notFound } from 'next/navigation'
import { getCurrentSchool, getSchoolCommunications } from '@/lib/school'
import Hero from '@/components/Hero/Hero'
import { CommunicationsList } from '@/components/CommunicationsList/CommunicationsList'
import { EmailSubscription } from '@/components/EmailSubscription/EmailSubscription'

export default async function ComunicazioniPage() {
  // Get school from subdomain/domain
  const school = await getCurrentSchool()

  if (!school) {
    notFound()
  }

  const { docs: communications } = await getSchoolCommunications(school.id)

  return (
    <>
      <Hero
        title="Comunicazioni di Servizio"
        subtitle={`Avvisi e informazioni importanti di ${school.name}`}
        primaryColor={school.primaryColor || undefined}
        secondaryColor={school.secondaryColor || undefined}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <EmailSubscription schoolId={school.id} />
        </div>

        {communications.length > 0 ? (
          <CommunicationsList communications={communications} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nessuna comunicazione al momento.</p>
          </div>
        )}
      </div>
    </>
  )
}
