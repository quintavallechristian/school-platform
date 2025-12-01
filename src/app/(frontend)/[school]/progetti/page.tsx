import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentSchool, getSchoolProjects, isFeatureEnabled } from '@/lib/school'
import { getSchoolBaseHref } from '@/lib/linkUtils'
import { headers } from 'next/headers'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import type { Project } from '@/payload-types'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'
import EmptyArea from '@/components/EmptyArea/EmptyArea'

export default async function ProjectsPage({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  const headersList = await headers()
  const host = headersList.get('host') || ''
  const baseHref = getSchoolBaseHref(school, host)

  // Reindirizza alla homepage se la feature progetti è disabilitata
  if (!isFeatureEnabled(school, 'projects')) {
    redirect(`/${schoolSlug}`)
  }

  const { docs: projects } = await getSchoolProjects(school.id, 50)

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Hero
        title="I Nostri Progetti"
        subtitle="Scopri le attività didattiche e creative della nostra scuola"
        backgroundImage="/images/projects-hero.jpg"
      />
      <Breadcrumbs baseHref={baseHref} />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(projects as Project[]).map((project) => (
                <SpotlightCard key={project.id} className="px-0 py-0">
                  <Link href={`/${schoolSlug}/progetti/${project.id}`}>
                    {project.cover && typeof project.cover === 'object' && project.cover.url && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={project.cover.url}
                          alt={project.cover.alt || project.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300 rounded-t-2xl"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
                      <Button className="w-fit" size="sm">
                        Vedi progetto
                      </Button>
                    </div>
                  </Link>
                </SpotlightCard>
              ))}
            </div>
          ) : (
            <SpotlightCard className="max-w-4xl mx-auto px-0 py-0">
              <EmptyArea
                title="Nessun progetto disponibile al momento."
                message="Tuttavia, puoi sempre visitare la homepage per informazioni generali."
              />
            </SpotlightCard>
          )}
        </div>
      </section>
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
    title: `Progetti - ${school.name}`,
  }
}
