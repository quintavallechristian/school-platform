import Hero from '@/components/Hero/Hero'
import { LandingFooter } from '@/components/LandingPage/LandingFooter'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { FAQContent } from '@/components/FAQ/FAQContent'
import { GenericNavbar } from '@/components/Navbar/GenericNavbar'

export default function FAQPage() {
  return (
    <>
      <GenericNavbar />
      <div className="min-h-[calc(100vh-200px)] mb-20">
        <Hero title="Domande Frequenti" big={false} />
        <SpotlightCard className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
          <FAQContent />
        </SpotlightCard>
      </div>
      <LandingFooter />
    </>
  )
}
