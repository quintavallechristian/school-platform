import { notFound } from 'next/navigation'
import { getCurrentSchool, getSchoolPage } from '@/lib/school'
import PageBlocks from '@/components/PageBlocks/PageBlocks'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import type { Page as PageType } from '@/payload-types'
import { RichTextRenderer } from '@/components/RichTextRenderer/RichTextRenderer'
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

  // Funzione per verificare se il contenuto Lexical ha del testo reale
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

    // Funzione ricorsiva per cercare testo nei nodi
    const hasTextInNode = (node: unknown): boolean => {
      if (!node || typeof node !== 'object') {
        return false
      }

      const lexicalNode = node as Record<string, unknown>

      // Se il nodo ha testo non vuoto
      if (typeof lexicalNode.text === 'string' && lexicalNode.text.trim().length > 0) {
        return true
      }

      // Se il nodo ha figli, controlla ricorsivamente
      if (Array.isArray(lexicalNode.children)) {
        return lexicalNode.children.some((child) => hasTextInNode(child))
      }

      return false
    }

    // Controlla tutti i nodi root
    return root.children.some((child) => hasTextInNode(child))
  }

  const hasContent = hasRealContent(page.content)

  // Prepara il divisore inferiore per la copertina di default
  const bottomDivider =
    (page as PageType).heroBottomDivider?.enabled && (page as PageType).heroBottomDivider?.style
      ? {
          style: (page as PageType).heroBottomDivider!.style as ShapeDividerStyle,
          height: (page as PageType).heroBottomDivider!.height || undefined,
          flip: (page as PageType).heroBottomDivider!.flip || undefined,
          invert: (page as PageType).heroBottomDivider!.invert || undefined,
        }
      : undefined

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {shouldShowDefaultHero && (
        <Hero
          title={page.title}
          subtitle={page.subtitle || undefined}
          big={heroFullHeight}
          backgroundImage={(page as PageType).heroSettings?.backgroundImage || undefined}
          parallax={(page as PageType).heroSettings?.parallax || false}
          gradientOverlay={(page as PageType).heroSettings?.gradientOverlay || false}
          bottomDivider={bottomDivider}
        />
      )}

      <section>
        {hasContent && page.content && (
          <SpotlightCard
            className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-0 ${shouldShowDefaultHero ? '-mt-16' : 'mt-8'}`}
          >
            <RichTextRenderer content={page.content} />
          </SpotlightCard>
        )}
        <PageBlocks blocks={page.blocks} schoolId={school.id} schoolSlug={schoolSlug} />
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
    title: typedPage.seo?.metaTitle || typedPage.title || `${school.name}`,
    description: typedPage.seo?.metaDescription || typedPage.subtitle || undefined,
  }
}
