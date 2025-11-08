import { notFound } from 'next/navigation'
import { getCurrentSchool, getSchoolCommunications } from '@/lib/school'
import Hero from '@/components/Hero/Hero'
import { CommunicationsList } from '@/components/CommunicationsList/CommunicationsList'
import { EmailSubscription } from '@/components/EmailSubscription/EmailSubscription'

export default async function ComunicazioniPage({
  params,
}: {
  params: Promise<{ school: string }>
}) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  const { docs: communications } = await getSchoolCommunications(school.id)

  return (
    <>
      <Hero
        title="Comunicazioni di Servizio"
        subtitle={`Avvisi e informazioni importanti di ${school.name}`}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <EmailSubscription schoolId={school.id} />
        </div>

        {communications.length > 0 ? (
          <CommunicationsList communications={communications} schoolSlug={schoolSlug} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nessuna comunicazione al momento.</p>
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
    title: `Comunicazioni - ${school.name}`,
    description: `Tutte le comunicazioni importanti di ${school.name}. Resta aggiornato sulle novità della scuola.`,
  }
}
