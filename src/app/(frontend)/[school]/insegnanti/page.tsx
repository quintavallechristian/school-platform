import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCurrentSchool, getSchoolTeachers } from '@/lib/school'

type PageProps = {
  params: Promise<{ school: string }>
}

export default async function InsegnantiPage({ params }: PageProps) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  const teachers = await getSchoolTeachers(school.id)

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-6">👨‍🏫 I Nostri Insegnanti</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Conosci il team di {school.name}
          </p>
        </header>

        {/* Teachers Grid */}
        {teachers.docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.docs.map((teacher) => (
              <Link
                key={teacher.id}
                href={`/${schoolSlug}/insegnanti/${teacher.id}`}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                {teacher.photo && typeof teacher.photo === 'object' && teacher.photo.url && (
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={teacher.photo.url}
                      alt={teacher.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {teacher.name}
                  </h3>

                  {teacher.role && (
                    <p className="text-primary font-semibold mb-3">{teacher.role}</p>
                  )}

                  {teacher.bio && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {teacher.bio}
                    </p>
                  )}

                  <div className="mt-4 text-sm text-primary font-semibold">Scopri di più →</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Informazioni sul team in arrivo...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    return {
      title: 'Scuola non trovata',
    }
  }

  return {
    title: `Insegnanti - ${school.name}`,
    description: `Conosci il team di insegnanti di ${school.name}. Scopri chi sono e cosa insegnano.`,
  }
}
