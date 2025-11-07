import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import type { Teacher, Media } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function InsegnantePage({ params }: Props) {
  const { id } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let teacher: Teacher

  try {
    teacher = await payload.findByID({
      collection: 'teachers',
      id: id,
    })
  } catch (_error) {
    notFound()
  }

  const photo = typeof teacher.photo === 'object' ? (teacher.photo as Media) : null

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12 mb-12">
          <aside className="flex flex-col gap-8">
            <SpotlightCard className="px-0 py-0">
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
                  <h3 className="text-2xl font-bold text-gray-800">{teacher.name}</h3>
                  {teacher.subject && (
                    <p className="text-emerald-600 font-semibold mb-4 text-sm">{teacher.subject}</p>
                  )}
                </div>
              </Link>
            </SpotlightCard>
          </aside>

          <main className="flex flex-col gap-8">
            <SpotlightCard>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-4 border-emerald-500 pb-3">
                Biografia
              </h2>
              {teacher.bio ? (
                <div className="text-lg leading-relaxed text-gray-600 space-y-4">
                  {teacher.bio.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-8">
                  Nessuna biografia disponibile al momento.
                </p>
              )}
            </SpotlightCard>
          </main>
        </div>

        <footer className="py-8">
          <Link
            href="/chi-siamo/insegnanti"
            className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-4 transition-all"
          >
            ← Torna agli Insegnanti
          </Link>
        </footer>
      </div>
    </div>
  )
}
