import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import {
  getCurrentSchool,
  getSchoolActiveEducationalOffering,
  isFeatureEnabled,
} from '@/lib/school'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import GalleryView from '@/components/GalleryView/GalleryView'
import { RichTextRenderer } from '@/components/RichTextRenderer/RichTextRenderer'
import EmptyArea from '@/components/EmptyArea/EmptyArea'

export default async function EducationalOfferingPage({
  params,
}: {
  params: Promise<{ school: string }>
}) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  // Reindirizza alla homepage se la feature piano offerta formativa è disabilitata
  if (!isFeatureEnabled(school, 'educationalOfferings')) {
    redirect(`/${schoolSlug}`)
  }

  const offering = await getSchoolActiveEducationalOffering(school.id)

  if (!offering) {
    return (
      <div className="min-h-[calc(100vh-200px)]">
        <Hero title="Piano Offerta Formativa" />
        <SpotlightCard className="max-w-4xl mx-auto -mt-16 px-0 py-0">
          <EmptyArea
            title="Nessun piano offerta formativa attivo al momento."
            message="Tuttavia, puoi sempre visitare la homepage per informazioni generali."
          />
        </SpotlightCard>
      </div>
    )
  }

  const gallery = offering.gallery && typeof offering.gallery === 'object' ? offering.gallery : null

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <article className="max-w-full">
        <header>
          <Hero
            title={offering.title}
            subtitle="Piano Offerta Formativa"
            backgroundImage={offering.cover}
            gradientOverlay={offering.gradientOverlay || false}
          />
        </header>

        <div className="py-8 px-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm">
              <Link href={`/${schoolSlug}`} className="text-primary hover:underline">
                Home
              </Link>
              {' / '}
              <span className="text-muted-foreground">Piano Offerta Formativa</span>
            </nav>

            {/* Content */}
            {offering.description ? (
              <SpotlightCard>
                <RichTextRenderer content={offering.description} />
              </SpotlightCard>
            ) : (
              <p className="text-center text-muted-foreground italic py-8">
                Nessuna descrizione disponibile per questo piano offerta formativa.
              </p>
            )}
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

export async function generateMetadata({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    return {
      title: 'Scuola non trovata',
    }
  }

  const offering = await getSchoolActiveEducationalOffering(school.id)

  if (!offering) {
    return {
      title: `Piano Offerta Formativa - ${school.name}`,
    }
  }

  return {
    title: `${offering.title} - ${school.name}`,
    description: offering.title,
    openGraph:
      offering.cover && typeof offering.cover === 'object' && offering.cover.url
        ? {
            images: [offering.cover.url],
          }
        : undefined,
  }
}
