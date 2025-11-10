'use client'

import React, { useState } from 'react'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Button } from '@/components/ui/button'

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfetto per scuole piccole che iniziano il loro percorso digitale',
    monthlyPrice: 49,
    yearlyPrice: 470,
    features: [
      'Fino a 100 famiglie',
      'Comunicazioni illimitate',
      'Blog e articoli',
      'Calendario eventi',
      'Menu settimanale',
      '1 Galleria fotografica',
      'Supporto via email',
      'Personalizzazione base',
    ],
    highlighted: false,
    trialDays: 30,
  },
  {
    name: 'Professional',
    description: 'La scelta ideale per scuole che vogliono il massimo',
    monthlyPrice: 99,
    yearlyPrice: 950,
    features: [
      'Fino a 300 famiglie',
      'Tutte le funzionalità Starter',
      'Gallerie fotografiche illimitate',
      'Gestione multi-sezione',
      'Notifiche push personalizzate',
      'Analytics avanzate',
      'Supporto prioritario',
      'Personalizzazione completa',
      'Backup giornalieri',
    ],
    highlighted: true,
    trialDays: 30,
  },
  {
    name: 'Enterprise',
    description: 'Per istituti scolastici con esigenze complesse',
    monthlyPrice: 199,
    yearlyPrice: 1910,
    features: [
      'Famiglie illimitate',
      'Tutte le funzionalità Professional',
      'Multi-tenant (più scuole)',
      'API personalizzate',
      'Integrazioni su misura',
      'Account manager dedicato',
      'Formazione personalizzata',
      'SLA garantito 99.9%',
      'Backup continui',
    ],
    highlighted: false,
    trialDays: 30,
  },
]

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')

  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCost = monthlyPrice * 12
    const savings = monthlyCost - yearlyPrice
    const savingsPercentage = Math.round((savings / monthlyCost) * 100)
    return savingsPercentage
  }

  return (
    <section className="py-24 px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Prezzi trasparenti e flessibili</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Inizia con 30 giorni di prova gratuita. Nessuna carta di credito richiesta.
          </p>

          {/* Billing Period Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-background rounded-full border">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mensile
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annuale
              <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">
                Risparmia fino al 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <SpotlightCard
              key={index}
              className={plan.highlighted ? 'ring-2 ring-primary scale-105' : ''}
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
                      <span className="text-emerald-500 mt-1">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  size="lg"
                >
                  Inizia la prova gratuita
                </Button>
              </div>
            </SpotlightCard>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          Tutti i piani includono aggiornamenti gratuiti e supporto tecnico. <br />
          Puoi annullare in qualsiasi momento senza costi aggiuntivi.
        </p>
      </div>
    </section>
  )
}
