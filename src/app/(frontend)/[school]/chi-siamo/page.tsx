import { notFound } from 'next/navigation'
import { getCurrentSchool, getSchoolChiSiamo, getSchoolTeachers } from '@/lib/school'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { RichTextRenderer } from '@/components/RichTextRenderer/RichTextRenderer'
import type { ChiSiamo as ChiSiamoType } from '@/payload-types'
import type { ShapeDividerStyle } from '@/components/ShapeDivider/ShapeDivider'
import Image from 'next/image'
import Link from 'next/link'

type PageProps = {
  params: Promise<{ school: string }>
}

export default async function ChiSiamoPage({ params }: PageProps) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    console.log('cioa')
    notFound()
  }

  // Recupera la Global ChiSiamo
  const chiSiamo = await getSchoolChiSiamo(school.id)

  // Se non è configurata o non è personalizzata, mostra la versione di default con lista insegnanti
  if (!chiSiamo || !chiSiamo.customizeChiSiamo) {
    const teachers = await getSchoolTeachers(school.id)

    return (
      <div className="min-h-[calc(100vh-200px)]">
        <Hero title="Chi Siamo" subtitle="Scopri il nostro team di insegnanti" big={false} />

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-primary text-4xl font-bold text-center mb-12">Il Nostro Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.docs.length > 0 ? (
                teachers.docs.map((teacher) => {
                  const imageUrl =
                    teacher.photo && typeof teacher.photo === 'object' ? teacher.photo.url : null

                  return (
                    <SpotlightCard key={teacher.id}>
                      {imageUrl && (
                        <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                          <Image src={imageUrl} alt={teacher.name} fill className="object-cover" />
                        </div>
                      )}
                      <h3 className="text-2xl font-bold mb-2">{teacher.name}</h3>
                      {teacher.subject && (
                        <p className="text-lg mb-4 text-primary font-semibold">{teacher.subject}</p>
                      )}
                      {teacher.bio && <p className="leading-relaxed">{teacher.bio}</p>}
                      {teacher.email && (
                        <p className="mt-4 text-sm">
                          <a href={`mailto:${teacher.email}`} className="text-primary underline">
                            {teacher.email}
                          </a>
                        </p>
                      )}
                    </SpotlightCard>
                  )
                })
              ) : (
                <p className="text-center col-span-full py-8">
                  Nessun insegnante disponibile al momento.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Se è personalizzata, mostra la versione personalizzata
  const typedPage = chiSiamo as ChiSiamoType

  // Mostra l'hero di default solo se showHero è esplicitamente true o undefined
  const shouldShowDefaultHero =
    typedPage.heroSettings?.showHero === true || typedPage.heroSettings?.showHero === undefined
  const heroFullHeight = typedPage.heroSettings?.fullHeight ?? false

  // Verifica se il contenuto ha del testo reale
  const hasRealContent = (content: unknown): boolean => {
    if (!content || typeof content !== 'object' || content === null) {
      return false
    }
    const lexicalContent = content as Record<string, unknown>
    if (!lexicalContent.root || typeof lexicalContent.root !== 'object') {
      return false
    }
    const root = lexicalContent.root as Record<string, unknown>
    if (!Array.isArray(root.children)) {
      return false
    }
    const hasTextInNode = (node: unknown): boolean => {
      if (!node || typeof node !== 'object') {
        return false
      }
      const lexicalNode = node as Record<string, unknown>
      if (typeof lexicalNode.text === 'string' && lexicalNode.text.trim().length > 0) {
        return true
      }
      if (Array.isArray(lexicalNode.children)) {
        return lexicalNode.children.some((child) => hasTextInNode(child))
      }
      return false
    }
    return root.children.some((child) => hasTextInNode(child))
  }

  const hasContent = hasRealContent(typedPage.content)

  // Prepara il divisore inferiore per l'hero di default
  const bottomDivider =
    typedPage.heroSettings?.bottomDivider?.enabled && typedPage.heroSettings?.bottomDivider?.style
      ? {
          style: typedPage.heroSettings.bottomDivider.style as ShapeDividerStyle,
          height: typedPage.heroSettings.bottomDivider.height || undefined,
          flip: typedPage.heroSettings.bottomDivider.flip || undefined,
          invert: typedPage.heroSettings.bottomDivider.invert || undefined,
        }
      : undefined

  // Recupera gli insegnanti se la sezione è abilitata
  const shouldShowTeachers = typedPage.teachersSection?.enabled ?? true
  const teachers = shouldShowTeachers ? await getSchoolTeachers(school.id) : null

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {shouldShowDefaultHero && (
        <Hero
          title={typedPage.heroSettings?.title || 'Chi Siamo'}
          subtitle={typedPage.heroSettings?.subtitle || undefined}
          big={heroFullHeight}
          backgroundImage={typedPage.heroSettings?.backgroundImage || undefined}
          parallax={typedPage.heroSettings?.parallax || false}
          gradientOverlay={typedPage.heroSettings?.gradientOverlay || false}
          bottomDivider={bottomDivider}
        />
      )}

      <section>
        {hasContent && typedPage.content && (
          <SpotlightCard
            className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-0 ${shouldShowDefaultHero ? '-mt-16' : 'mt-8'}`}
          >
            <RichTextRenderer content={typedPage.content} />
            ciao
          </SpotlightCard>
        )}

        {shouldShowTeachers && teachers && teachers.docs.length > 0 && (
          <div className="py-16">
            <div className="max-w-7xl mx-auto px-8">
              {(typedPage.teachersSection?.title || typedPage.teachersSection?.subtitle) && (
                <div className="text-center mb-12">
                  {typedPage.teachersSection?.title && (
                    <h2 className="text-primary text-4xl font-bold mb-2">
                      {typedPage.teachersSection.title}
                    </h2>
                  )}
                  {typedPage.teachersSection?.subtitle && (
                    <p className="text-lg text-muted-foreground">
                      {typedPage.teachersSection.subtitle}
                    </p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teachers.docs.map((teacher) => {
                  const imageUrl =
                    teacher.photo && typeof teacher.photo === 'object' ? teacher.photo.url : null

                  return (
                    <Link key={teacher.id} href={`/${schoolSlug}/insegnanti/${teacher.id}`}>
                      <SpotlightCard>
                        {imageUrl && (
                          <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={teacher.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <h3 className="text-2xl font-bold mb-2">{teacher.name}</h3>
                        {teacher.subject && (
                          <p className="text-lg mb-4 text-primary font-semibold">
                            {teacher.subject}
                          </p>
                        )}
                        {teacher.bio && <p className="leading-relaxed">{teacher.bio}</p>}
                        {teacher.email && (
                          <p className="mt-4 text-sm">
                            <a href={`mailto:${teacher.email}`} className="text-primary underline">
                              {teacher.email}
                            </a>
                          </p>
                        )}
                      </SpotlightCard>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
