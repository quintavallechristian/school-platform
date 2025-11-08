import { notFound } from 'next/navigation'
import { getCurrentSchool, getSchoolPage } from '@/lib/school'
import { RichText } from '@payloadcms/richtext-lexical/react'
import PageBlocks from '@/components/PageBlocks/PageBlocks'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import type { Page as PageType } from '@/payload-types'
import { RichTextRenderer } from '@/components/RichTextRenderer/RichTextRenderer'

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

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Hero title={page.title} subtitle={page.subtitle || undefined} />

      <section>
        {page.content && (
          <SpotlightCard className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-0 -mt-16">
            <RichTextRenderer content={page.content} />
          </SpotlightCard>
        )}
        <PageBlocks blocks={page.blocks} />
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
