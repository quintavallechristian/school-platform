import React from 'react'
import Hero from '@/components/Hero/Hero'
import { FeaturesSection } from '@/components/LandingPage/FeaturesSection'
import { PricingSection } from '@/components/LandingPage/PricingSection'
import { TestimonialsSection } from '@/components/LandingPage/TestimonialsSection'
import { LandingFooter } from '@/components/LandingPage/LandingFooter'

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero
        title="La piattaforma digitale per la tua scuola"
        subtitle="Comunica con le famiglie, gestisci eventi e contenuti, condividi foto e molto altro. Tutto in un'unica soluzione semplice e sicura."
        buttons={[
          { text: 'Inizia gratis per 30 giorni', href: '#pricing' },
          { text: 'Prenota una demo', href: '#contact', variant: 'outline' },
        ]}
        big={true}
      />

      <FeaturesSection />

      <div id="pricing">
        <PricingSection />
      </div>

      {/* <TestimonialsSection /> */}

      <LandingFooter />
    </div>
  )
}
