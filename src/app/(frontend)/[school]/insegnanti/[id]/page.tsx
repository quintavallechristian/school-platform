import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCurrentSchool } from '@/lib/school'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'

type PageProps = {
  params: Promise<{ school: string; id: string }>
}

async function getTeacher(teacherId: string, schoolId: string | number) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'teachers',
    where: {
      and: [{ id: { equals: teacherId } }, { school: { equals: schoolId } }],
    },
    limit: 1,
  })

  return result.docs[0] || null
}

export default async function InsegnanteDetailPage({ params }: PageProps) {
  const { school: schoolSlug, id } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  const teacher = await getTeacher(id, school.id)

  if (!teacher) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-0 pb-8">
      <Hero
        title={teacher.name}
        subtitle={teacher.subject ? `Materia: ${teacher.subject}` : undefined}
        big={false}
      />
      <div className="max-w-4xl mx-auto flex gap-4 items-center pt-8">
        {teacher.photo && typeof teacher.photo === 'object' && teacher.photo.url && (
          <Image
            src={teacher.photo.url}
            alt={teacher.name}
            width={300}
            height={300}
            priority
            className="rounded-xl"
          />
        )}
        <SpotlightCard className="p-8 md:flex-1 flex flex-col justify-center">
          {teacher.bio && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Chi sono</h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                {teacher.bio}
              </p>
            </div>
          )}

          {teacher.role && (
            <p className="text-lg text-primary font-semibold mb-2">{teacher.role}</p>
          )}

          {teacher.email && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-3">Contatti</h2>
              <a
                href={`mailto:${teacher.email}`}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {teacher.email}
              </a>
            </div>
          )}
        </SpotlightCard>
      </div>
      <nav className="mt-8 text-sm">
        <Link
          href={`/${schoolSlug}/insegnanti`}
          className="text-primary hover:underline inline-flex items-center gap-2"
        >
          ← Torna agli insegnanti
        </Link>
      </nav>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { school: schoolSlug, id } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    return {
      title: 'Scuola non trovata',
    }
  }

  const teacher = await getTeacher(id, school.id)

  if (!teacher) {
    return {
      title: 'Insegnante non trovato',
    }
  }

  return {
    title: `${teacher.name} - ${school.name}`,
    description: teacher.bio
      ? teacher.bio.substring(0, 160)
      : `Profilo di ${teacher.name}, ${teacher.role || 'insegnante'} presso ${school.name}`,
  }
}
