import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentSchool, getSchoolProjectById, isFeatureEnabled } from '@/lib/school'
import React from 'react'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import GalleryView from '@/components/GalleryView/GalleryView'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { RichTextRenderer } from '@/components/RichTextRenderer/RichTextRenderer'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ school: string; id: string }>
}) {
  const { school: schoolSlug, id } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  // Reindirizza alla homepage se la feature progetti è disabilitata
  if (!isFeatureEnabled(school, 'projects')) {
    redirect(`/${schoolSlug}`)
  }

  const project = await getSchoolProjectById(school.id, id)

  if (!project) {
    notFound()
  }

  const gallery = project.gallery && typeof project.gallery === 'object' ? project.gallery : null

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <article className="max-w-full">
        <header>
          <Hero
            title={project.title}
            subtitle="Progetto della scuola"
            backgroundImage={project.cover}
            gradientOverlay={project.gradientOverlay || false}
          />
        </header>

        <Breadcrumbs />

        <div className="py-8 px-8">
          <div className="max-w-4xl mx-auto">
            {/* Content */}
            {project.description ? (
              <SpotlightCard>
                <RichTextRenderer content={project.description} />
              </SpotlightCard>
            ) : (
              <p className="text-center text-muted-foreground italic py-8">
                Nessuna descrizione disponibile per questo progetto.
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ school: string; id: string }>
}) {
  const { school: schoolSlug, id } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    return {
      title: 'Scuola non trovata',
    }
  }

  const project = await getSchoolProjectById(school.id, id)

  if (!project) {
    return {
      title: 'Progetto non trovato',
    }
  }

  return {
    title: `${project.title} - ${school.name}`,
    description: project.title,
    openGraph:
      project.cover && typeof project.cover === 'object' && project.cover.url
        ? {
            images: [project.cover.url],
          }
        : undefined,
  }
}
