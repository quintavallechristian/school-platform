import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCurrentSchool } from '@/lib/school'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

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
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link
            href={`/${schoolSlug}/insegnanti`}
            className="text-primary hover:underline inline-flex items-center gap-2"
          >
            ← Torna agli insegnanti
          </Link>
        </nav>

        {/* Teacher Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Photo */}
            {teacher.photo && typeof teacher.photo === 'object' && teacher.photo.url && (
              <div className="md:w-1/3 relative h-96 md:h-auto">
                <Image
                  src={teacher.photo.url}
                  alt={teacher.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Info */}
            <div className="p-8 md:flex-1">
              <div className="mb-6">
                <h1 className="text-4xl font-bold mb-2">{teacher.name}</h1>
                {teacher.role && (
                  <p className="text-xl text-primary font-semibold mb-4">{teacher.role}</p>
                )}
                {teacher.subject && (
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Materia:</span> {teacher.subject}
                  </p>
                )}
              </div>

              {teacher.bio && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3">Chi sono</h2>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                    {teacher.bio}
                  </p>
                </div>
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
            </div>
          </div>
        </div>
      </div>
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
