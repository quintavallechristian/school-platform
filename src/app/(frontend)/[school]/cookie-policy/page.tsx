import { notFound } from 'next/navigation'
import { getCurrentSchool, getSchoolCookiePolicy } from '@/lib/school'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { RichTextRenderer } from '@/components/RichTextRenderer/RichTextRenderer'
import type { CookiePolicy as CookiePolicyType } from '@/payload-types'

type PageProps = {
  params: Promise<{ school: string }>
}

export default async function CookiePolicyPage({ params }: PageProps) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  const cookiePolicy = await getSchoolCookiePolicy(school.id)

  console.log(cookiePolicy)
  if (!cookiePolicy) {
    return (
      <div className="min-h-[calc(100vh-200px)]">
        <Hero title="Cookie Policy" big={false} />
        <SpotlightCard className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12`}>
          Testo di default
        </SpotlightCard>
      </div>
    )
  }

  // Se è personalizzata, mostra la versione personalizzata
  const typedPage = cookiePolicy as CookiePolicyType
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

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Hero title="Cookie Policy" big={false} />
      <section>
        {hasContent && typedPage.content && (
          <SpotlightCard className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12`}>
            <RichTextRenderer content={typedPage.content} />
          </SpotlightCard>
        )}
      </section>
    </div>
  )
}
