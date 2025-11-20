import React from 'react'
import type { Testimonial, Media, Homepage } from '@/payload-types'
import Image from 'next/image'
import { getSchoolTestimonials } from '@/lib/school'
import Link from 'next/link'
import SpotlightCard from '../SpotlightCard/SpotlightCard'
import { Button } from '../ui/button'

// Tipi per il block
export type TestimonialsBlockType = Extract<
  NonNullable<Homepage['blocks']>[number],
  { blockType: 'testimonials' }
>

type Props = {
  block: TestimonialsBlockType
  schoolId: string | number
  schoolSlug: string
}

export default async function TestimonialsBlock({ block, schoolId, schoolSlug }: Props) {
  const testimonials = await getSchoolTestimonials(schoolId, block.limit || 6)
  console.log('Testimonials fetched:', testimonials, schoolId)

  // Se non ci sono testimonianze, non mostrare nulla o mostrare un messaggio
  if (testimonials.docs.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          {block.title && (
            <h2 className="text-3xl font-bold mb-8 text-center text-primary">{block.title}</h2>
          )}
          <div className="text-center py-12">
            <p className="text-gray-500">Testimonianze in arrivo...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        {block.title && (
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">{block.title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.docs.map((t: Testimonial) => (
            <SpotlightCard key={t.id} className="flex flex-col items-center text-center">
              {t.photo && typeof t.photo === 'object' && (t.photo as Media).url && (
                <div className="relative w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-primary">
                  <Image
                    src={(t.photo as Media).url!}
                    alt={t.authorName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <blockquote className="italic text-lg mb-4">“{t.content}”</blockquote>
              <div className="font-bold text-primary text-lg">{t.authorName}</div>
              {t.role && <div className="text-sm text-muted-foreground mb-1">{t.role}</div>}
            </SpotlightCard>
          ))}
        </div>
        {block.showViewAll && (
          <div className="text-center mt-8">
            <Link href={`/${schoolSlug}/testimonianze`}>
              <Button variant="outline" size="lg">
                Vedi tutte le testimonianze →
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
