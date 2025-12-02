import { notFound, redirect } from 'next/navigation'
import { getCurrentSchool, isFeatureEnabled } from '@/lib/school'
import { getSchoolBaseHref } from '@/lib/linkUtils'
import { headers } from 'next/headers'
import Hero from '@/components/Hero/Hero'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { Document, Media } from '@/payload-types'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Star, FileX } from 'lucide-react'
import EmptyArea from '@/components/EmptyArea/EmptyArea'
import DownloadLink from '@/components/DownloadLink/DownloadLink'

// Funzione per ottenere i documenti di una scuola
async function getSchoolDocuments(schoolId: string) {
  const payload = await getPayload({ config })

  const now = new Date().toISOString()

  const { docs } = await payload.find({
    collection: 'documents',
    where: {
      and: [
        { school: { equals: schoolId } },
        {
          or: [{ expiresAt: { exists: false } }, { expiresAt: { greater_than: now } }],
        },
      ],
    },
    sort: '-featured,order,-publishedAt',
    limit: 100,
  })

  return docs as Document[]
}

export default async function DocumentiPage({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  const headersList = await headers()
  const host = headersList.get('host') || ''
  const baseHref = getSchoolBaseHref(school, host)

  // Reindirizza alla homepage se la feature documenti è disabilitata
  if (!isFeatureEnabled(school, 'documents')) {
    redirect(`/${schoolSlug}`)
  }

  const documentSections = await getSchoolDocuments(school.id)

  // Raccogli tutti i documenti in evidenza da tutte le sezioni
  const featuredDocuments: Array<{
    file: Media
    fileItem: NonNullable<Document['files']>[number]
    sectionTitle: string
  }> = []

  documentSections.forEach((section) => {
    if (!section.files) return

    section.files.forEach((fileItem) => {
      if (fileItem.featured) {
        const file =
          typeof fileItem.file === 'object' && fileItem.file !== null ? fileItem.file : null
        if (file) {
          featuredDocuments.push({
            file: file as Media,
            fileItem,
            sectionTitle: section.title,
          })
        }
      }
    })
  })

  return (
    <div className="min-h-screen">
      <Hero
        title="Documenti"
        subtitle="Scarica i documenti e la modulistica della scuola"
        backgroundImage="/images/documents-hero.jpg"
      />
      <Breadcrumbs baseHref={baseHref} />

      <div className="container mx-auto px-4 py-12">
        {/* Sezione documenti in evidenza */}
        {featuredDocuments.length > 0 && (
          <div className="mb-16">
            <h2 className="text-primary text-3xl font-bold mb-8 flex items-center gap-2">
              <Star className="h-8 w-8 text-amber-300 fill-amber-300" />
              In evidenza
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDocuments.map((item, idx) => (
                <SpotlightCard key={idx}>
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-primary mb-2">
                        {item.sectionTitle}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        {item.fileItem.title || item.file.filename || 'Documento'}
                      </h3>

                      {item.fileItem.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.fileItem.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-2">
                      <DownloadLink
                        url={item.file.url || '#'}
                        fileName={item.fileItem.title || item.file.filename || 'Documento'}
                        mimeType={item.file.mimeType || undefined}
                        category={item.sectionTitle}
                      >
                        Scarica
                      </DownloadLink>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        )}

        {documentSections.length > 0 ? (
          <div className="space-y-16">
            {documentSections.map((section) => (
              <div key={section.id}>
                {/* Titolo della sezione */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 text-primary">{section.title}</h2>
                  {section.description && (
                    <p className="text-muted-foreground text-lg">{section.description}</p>
                  )}
                </div>

                {/* Grid di card per i documenti */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.files?.map((fileItem, idx) => {
                    const file =
                      typeof fileItem.file === 'object' && fileItem.file !== null
                        ? fileItem.file
                        : null
                    if (!file) return null

                    return (
                      <SpotlightCard key={idx} className="px-4 py-4">
                        <div className="flex h-full items-center">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">
                              {fileItem.title || file.filename || 'Documento'}
                            </h3>

                            {fileItem.description && (
                              <p className="text-sm text-muted-foreground">
                                {fileItem.description}
                              </p>
                            )}
                          </div>

                          <DownloadLink
                            url={file.url || '#'}
                            fileName={fileItem.title || file.filename || 'Documento'}
                            mimeType={file.mimeType || undefined}
                            category={section.title}
                            size="sm"
                            aria-label="Scarica documento"
                          >
                            <span className="sr-only">Scarica</span>
                          </DownloadLink>
                        </div>
                      </SpotlightCard>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SpotlightCard className="max-w-4xl mx-auto px-0 py-0">
            <EmptyArea
              title="Nessun documento disponibile"
              icon={<FileX />}
              message="I documenti verranno pubblicati qui non appena disponibili."
            />
          </SpotlightCard>
        )}
      </div>
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

  return {
    title: `Documenti - ${school.name}`,
    description: `Area documenti di ${school.name} - Modulistica, regolamenti e risorse scaricabili`,
  }
}
