import Hero from '@/components/Hero/Hero'
import { LandingFooter } from '@/components/LandingPage/LandingFooter'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { TermsOfServiceContent } from '@/components/TermsOfService/TermsOfServiceContent'

export default function TermsPage() {
  return (
    <>
      <div className="min-h-[calc(100vh-200px)] mb-20">
        <Hero title="Termini e Condizioni" big={false} />
        <SpotlightCard className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
          <TermsOfServiceContent />
        </SpotlightCard>
      </div>
      <LandingFooter />
    </>
  )
}
