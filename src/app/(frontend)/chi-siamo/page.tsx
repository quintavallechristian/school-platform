import React from 'react'
import Link from 'next/link'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Button } from '@/components/ui/button'

export default async function ChiSiamoPage() {
  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Hero title="Scopri di più sulla nostra scuola e il nostro team di insegnanti"></Hero>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 ">La Nostra Missione</h2>
            <p className="text-lg leading-relaxed mb-6 ">
              La nostra scuola si impegna a fornire un&apos;educazione di qualità che prepara gli
              studenti per il futuro. Crediamo nell&apos;apprendimento innovativo e
              nell&apos;inclusività.
            </p>
            <p className="text-lg leading-relaxed ">
              Con un team di insegnanti dedicati e appassionati, creiamo un ambiente di
              apprendimento stimolante dove ogni studente può crescere e raggiungere il proprio
              potenziale.
            </p>
          </div>

          <SpotlightCard className="rounded-xl p-12 text-center max-w-2xl mx-auto mt-12">
            <h3 className="text-2xl font-bold mb-4 ">Conosci il Nostro Team</h3>
            <p className=" mb-8">Scopri i nostri insegnanti e le loro competenze</p>
            <Link href="/chi-siamo/insegnanti">
              <Button>Vedi gli Insegnanti</Button>
            </Link>
          </SpotlightCard>
        </div>
      </section>
    </div>
  )
}
