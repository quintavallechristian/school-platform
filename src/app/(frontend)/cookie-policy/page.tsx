import { notFound } from 'next/navigation'
import { getCurrentSchool } from '@/lib/school'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'

type PageProps = {
  params: Promise<{ school: string }>
}

export default async function CookiePolicyPage({ params }: PageProps) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

    return (
      <div className="min-h-[calc(100vh-200px)]">
        <Hero title="Cookie Policy" big={false} />
        <SpotlightCard className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12`}>
          Testo di default
        </SpotlightCard>
      </div>
    )
  
}
