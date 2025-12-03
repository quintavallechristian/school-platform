import Hero from '@/components/Hero/Hero'
import { LandingFooter } from '@/components/LandingPage/LandingFooter'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { ContactContent } from '@/components/Contact/ContactContent'

export default function ContactPage() {
  return (
    <>
      <div className="min-h-[calc(100vh-200px)] mb-20">
        <Hero title="Contattaci" big={false} />
        <SpotlightCard className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
          <ContactContent />
        </SpotlightCard>
      </div>
      <LandingFooter />
    </>
  )
}
