import { notFound } from 'next/navigation'
import { getCurrentSchool, getSchoolPage } from '@/lib/school'
import { getSchoolBaseHref } from '@/lib/linkUtils'
import { headers } from 'next/headers'
import PageBlocks from '@/components/PageBlocks/PageBlocks'
import Hero from '@/components/Hero/Hero'
import type { Page as PageType } from '@/payload-types'
import type { ShapeDividerStyle } from '@/components/ShapeDivider/ShapeDivider'

type Props = {
  params: Promise<{ school: string; slug: string }>
}

export default async function CustomPage({ params }: Props) {
  const { school: schoolSlug, slug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  const headersList = await headers()
  const host = headersList.get('host') || ''
  const baseHref = getSchoolBaseHref(school, host)

  const page = await getSchoolPage(school.id, slug)

  if (!page) {
    notFound()
  }

  // Mostra la copertina di default solo se showHero è esplicitamente true o undefined (per retrocompatibilità)
  // Se è esplicitamente false, non lo mostra
  const shouldShowDefaultHero =
    (page as PageType).heroSettings?.showHero === true ||
    (page as PageType).heroSettings?.showHero === undefined

  // Determina se la copertina deve essere full-height (default: false)
  const heroFullHeight = (page as PageType).heroSettings?.fullHeight ?? false

  // Prepara il divisore inferiore per la copertina di default
  const bottomDivider =
    (page as PageType).heroSettings?.bottomDivider?.enabled &&
    (page as PageType).heroSettings?.bottomDivider?.style
      ? {
          style: (page as PageType).heroSettings!.bottomDivider!.style as ShapeDividerStyle,
          height: (page as PageType).heroSettings!.bottomDivider!.height || undefined,
          flip: (page as PageType).heroSettings!.bottomDivider!.flip || undefined,
          invert: (page as PageType).heroSettings!.bottomDivider!.invert || undefined,
        }
      : undefined

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {shouldShowDefaultHero && (
        <Hero
          title={(page as PageType).heroSettings?.title || page.title}
          subtitle={(page as PageType).heroSettings?.subtitle || undefined}
          big={heroFullHeight}
          backgroundImage={(page as PageType).heroSettings?.backgroundImage || undefined}
          parallax={(page as PageType).heroSettings?.parallax || false}
          gradientOverlay={(page as PageType).heroSettings?.gradientOverlay || false}
          bottomDivider={bottomDivider}
        />
      )}

      <section>
        <PageBlocks
          blocks={page.blocks}
          schoolId={school.id}
          schoolSlug={schoolSlug}
          baseHref={baseHref}
        />
      </section>
    </div>
  )
}

export async function generateMetadata({ params }: Props) {
  const { school: schoolSlug, slug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    return {
      title: 'Scuola non trovata',
    }
  }

  const page = await getSchoolPage(school.id, slug)

  if (!page) {
    return {
      title: 'Pagina non trovata',
    }
  }

  const typedPage = page as PageType

  return {
    title: typedPage.heroSettings?.title || typedPage.title || `${school.name}`,
    description: typedPage.heroSettings?.subtitle || undefined,
  }
}
