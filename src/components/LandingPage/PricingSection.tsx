'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Button } from '@/components/ui/button'
import { planDetails } from '@/lib/plans'
import { trackEvent } from '@/lib/analytics'
import ShapeDivider, { ShapeDividerStyle } from '../ShapeDivider/ShapeDivider'

export function PricingSection({
  bottomDivider,
  topDivider,
}: {
  bottomDivider?: {
    style: ShapeDividerStyle
    color?: string
    flip?: boolean
    invert?: boolean
    height?: number
  }
  topDivider?: {
    style: ShapeDividerStyle
    color?: string
    flip?: boolean
    invert?: boolean
    height?: number
  }
}) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [pageBackgroundColor, setPageBackgroundColor] = useState('#ffffff')

  useEffect(() => {
    // Funzione per aggiornare il colore di sfondo della pagina
    const updateBackgroundColor = () => {
      const bodyBg = getComputedStyle(document.body).backgroundColor
      if (bodyBg) {
        setPageBackgroundColor(bodyBg)
      }
    }

    // Aggiorna il colore al mount
    updateBackgroundColor()

    // Osserva i cambiamenti alla classe 'dark' sull'elemento html
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // Quando cambia la classe (dark mode toggle), aggiorna il colore
          updateBackgroundColor()
        }
      })
    })

    // Inizia ad osservare l'elemento html
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // Cleanup: rimuovi l'observer quando il componente viene smontato
    return () => {
      observer.disconnect()
    }
  }, [])

  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCost = monthlyPrice * 12
    const savings = monthlyCost - yearlyPrice
    const savingsPercentage = Math.round((savings / monthlyCost) * 100)
    return savingsPercentage
  }

  return (
    <section className="relative py-24 px-8 bg-muted/30">
      {topDivider && (
        <ShapeDivider
          style={topDivider.style}
          position="top"
          color={topDivider.color || pageBackgroundColor}
          flip={topDivider.flip}
          invert={topDivider.invert}
          height={topDivider.height}
        />
      )}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Prezzi trasparenti e flessibili</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Inizia con 30 giorni di prova gratuita. Nessuna carta di credito richiesta.
          </p>

          <div className="inline-flex items-center gap-1 p-1 bg-background rounded-full border cursor-pointer">
            <Button
              onClick={() => setBillingPeriod('monthly')}
              className="px-4 py-1.5 h-auto text-sm rounded-full transition-all"
              variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
              size="sm"
            >
              Mensile
            </Button>
            <Button
              onClick={() => setBillingPeriod('yearly')}
              className="px-4 py-1.5 h-auto text-sm rounded-full transition-all"
              variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
              size="sm"
            >
              Annuale
              <span className="ml-2 text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                -20%
              </span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {planDetails.map((plan, index) => (
            <SpotlightCard
              key={index}
              className={plan.highlighted ? 'ring-2 ring-primary md:scale-105' : ''}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-2xl">
                  PIÙ POPOLARE
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">
                      €{billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-muted-foreground">
                      /{billingPeriod === 'monthly' ? 'mese' : 'anno'}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-sm text-emerald-600 mt-2">
                      Risparmi il {calculateSavings(plan.monthlyPrice, plan.yearlyPrice)}% rispetto
                      al piano mensile
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    🎉 {plan.trialDays} giorni di prova gratuita
                  </p>
                </div>
                <ul className="space-y-3 mb-8 grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <span className="text-emerald-500 -mt-1">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={
                    '/register?priceId=' +
                    (billingPeriod === 'monthly' ? plan.monthlyPriceId : plan.yearlyPriceId)
                  }
                  className="block w-full text-center text-blue-600 hover:underline text-sm mt-1"
                  onClick={() => {
                    trackEvent('start_free_trial_click', {
                      plan_name: plan.name,
                      billing_period: billingPeriod,
                      price: billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice,
                      location: 'pricing_section',
                    })
                  }}
                >
                  <Button
                    className="w-full mb-2 py-2 px-4 h-auto text-base md:text-lg md:py-4"
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    Inizia la prova gratuita
                  </Button>
                </Link>
              </div>
            </SpotlightCard>
          ))}
        </div>

        <div className="text-center mt-16 mb-8">
          <p className="text-lg text-muted-foreground mb-4">
            Hai altre esigenze? Contattaci per capire come soddisfarle
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contattaci
            </Button>
          </Link>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          Tutti i piani includono aggiornamenti gratuiti e supporto tecnico. <br />
          Puoi annullare in qualsiasi momento senza costi aggiuntivi.
        </p>
      </div>
      {bottomDivider && (
        <ShapeDivider
          style={bottomDivider.style}
          position="bottom"
          color={bottomDivider.color || pageBackgroundColor}
          flip={bottomDivider.flip}
          invert={bottomDivider.invert}
          height={bottomDivider.height}
        />
      )}
    </section>
  )
}
