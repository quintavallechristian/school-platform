import { notFound, redirect } from 'next/navigation'
import { getCurrentSchool, getSchoolCommunications, isFeatureEnabled } from '@/lib/school'
import Hero from '@/components/Hero/Hero'
import { CommunicationsList } from '@/components/CommunicationsList/CommunicationsList'
import { EmailSubscription } from '@/components/EmailSubscription/EmailSubscription'
import EmptyArea from '@/components/EmptyArea/EmptyArea'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { headers } from 'next/headers'
import { getSchoolBaseHref } from '@/lib/linkUtils'

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

  // Reindirizza alla homepage se la feature comunicazioni è disabilitata
  if (!isFeatureEnabled(school, 'communications')) {
    redirect(`/${schoolSlug}`)
  }

  const { docs: communications } = await getSchoolCommunications(school.id)

  const headersList = await headers()
  const host = headersList.get('host') || ''
  const baseHref = getSchoolBaseHref(school, host)

  return (
    <>
      <Hero title="Comunicazioni di Servizio" />

      <div className="container mx-auto px-4 py-12">
        {school.featureVisibility?.enableEmailCommunications && (
          <div className="mb-8">
            <EmailSubscription schoolId={school.id} />
          </div>
        )}

        {communications.length > 0 ? (
          <CommunicationsList communications={communications} baseHref={baseHref} />
        ) : (
          <SpotlightCard className="px-0 py-0">
            <EmptyArea
              title="Nessuna comunicazione al momento"
              message="Non ci sono comunicazioni di servizio per questa scuola."
            />
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
    title: `Comunicazioni - ${school.name}`,
    description: `Tutte le comunicazioni importanti di ${school.name}. Resta aggiornato sulle novità della scuola.`,
  }
}
