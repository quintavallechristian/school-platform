import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentSchool, getSchoolTestimonials } from '@/lib/school'
import TestimonialsForm from '@/components/TestimonialsForm'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import type { Testimonial, Media } from '@/payload-types'
import Image from 'next/image'
import Hero from '@/components/Hero/Hero'

export default async function TestimonianzePage({ params }: { params: { school: string } }) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)
  if (!school) notFound()

  const testimonialsRes = await getSchoolTestimonials(school.id, 50)
  const testimonials = testimonialsRes.docs as Testimonial[]

  // Mostra le più recenti prima
  const sortedTestimonials = [...testimonials].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    return dateB - dateA
  })

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Hero title="Dicono di noi" />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {sortedTestimonials.length === 0 ? (
            <div className="text-center text-muted-foreground">Nessuna testimonianza presente.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sortedTestimonials.map((t) => (
                <SpotlightCard key={t.id} className="flex flex-col items-center text-center">
                  {t.photo && typeof t.photo === 'object' && (t.photo as Media).url && (
                    <div className="relative w-16 h-16 mb-3 rounded-full overflow-hidden border-2 border-primary">
                      <Image
                        src={(t.photo as Media).url!}
                        alt={t.authorName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <blockquote className="italic text-base mb-3">“{t.content}”</blockquote>
                  <div className="font-bold text-primary text-base">{t.authorName}</div>
                  {t.role && <div className="text-xs text-muted-foreground mb-1">{t.role}</div>}
                </SpotlightCard>
              ))}
            </div>
          )}
        </div>
        <div className="mt-12">
          <TestimonialsForm schoolId={school.id} />
        </div>
      </section>
    </div>
  )
}
