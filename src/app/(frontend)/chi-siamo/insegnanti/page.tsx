import { getPayload } from 'payload'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import config from '@/payload.config'
import type { Teacher, Media } from '@/payload-types'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import Hero from '@/components/Hero/Hero'

export default async function InsegnantiPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const teachers = await payload.find({
    collection: 'teachers',
    limit: 100,
    sort: 'name',
  })

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Hero title="Le nostre maestre" subtitle="Il cuore della nostra scuola" />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          {teachers.docs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.docs.map((teacher: Teacher) => {
                const photo = typeof teacher.photo === 'object' ? (teacher.photo as Media) : null

                return (
                  <SpotlightCard key={teacher.id} className="px-0 py-0">
                    <Link href={`/chi-siamo/insegnanti/${teacher.id}`}>
                      <div>
                        {photo?.url ? (
                          <Image
                            src={photo.url}
                            alt={teacher.name}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover rounded-t-2xl"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-5xl font-bold text-indigo-600">
                            <span>{teacher.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-2xl font-bold ">{teacher.name}</h3>
                        {teacher.subject && (
                          <p className="text-emerald-600 font-semibold mb-4 text-sm">
                            {teacher.subject}
                          </p>
                        )}
                        {teacher.bio && (
                          <p className=" leading-relaxed text-sm">
                            {teacher.bio.length > 120
                              ? teacher.bio.substring(0, 120) + '...'
                              : teacher.bio}
                          </p>
                        )}
                      </div>
                    </Link>
                  </SpotlightCard>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className=" text-lg">Nessun insegnante disponibile al momento.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
