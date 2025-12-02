import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getSchoolTeachers } from '@/lib/school'
import type { Page } from '@/payload-types'

type TeacherListBlockType = Extract<
  NonNullable<Page['blocks']>[number],
  { blockType: 'teacherList' }
>

type Props = {
  block: TeacherListBlockType
  schoolId: string | number
  schoolSlug: string
  baseHref?: string
}

export default async function TeacherListBlock({ block, schoolId, baseHref }: Props) {
  const teachers = await getSchoolTeachers(schoolId)

  // Se non ci sono insegnanti, non mostrare nulla o mostrare un messaggio
  if (teachers.docs.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          {block.title && (
            <h2 className="text-3xl font-bold mb-8 text-center text-primary">{block.title}</h2>
          )}
          <div className="text-center py-12">
            <p className="text-gray-500">Informazioni sul team in arrivo...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {block.title && (
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">{block.title}</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.docs.map((teacher) => (
            <Link
              key={teacher.id}
              href={`${baseHref}/insegnanti/${teacher.id}`}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              {teacher.photo && typeof teacher.photo === 'object' && teacher.photo.url && (
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={teacher.photo.url}
                    alt={teacher.photo.alt || teacher.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {teacher.name}
                </h3>

                {teacher.role && <p className="text-primary font-semibold mb-3">{teacher.role}</p>}

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
      </div>
    </section>
  )
}
