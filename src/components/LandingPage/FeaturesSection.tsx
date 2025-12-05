'use client'

import React, { useState, useEffect } from 'react'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Bell, Calendar, FileText, UtensilsCrossed, Users, Palette } from 'lucide-react'
import ShapeDivider, { ShapeDividerStyle } from '../ShapeDivider/ShapeDivider'

const features = [
  {
    icon: FileText,
    title: 'Blog e Articoli',
    description:
      'Condividi storie, progetti didattici e aggiornamenti attraverso articoli multimediali.',
  },
  {
    icon: Bell,
    title: 'Comunicazioni scuola famiglia',
    description:
      'Invia comunicazioni importanti, newsletter e avvisi personalizzati direttamente ai genitori.',
  },
  {
    icon: Calendar,
    title: 'Calendario Eventi',
    description:
      'Gestisci eventi, gite e appuntamenti in un calendario condiviso e sempre aggiornato.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Menu Settimanale',
    description: 'Pubblica il menu della mensa con informazioni nutrizionali e allergeni.',
  },
  // {
  //   icon: Image,
  //   title: 'Gallerie Fotografiche',
  //   description: 'Crea album fotografici per documentare le attività e i momenti speciali.',
  // },
  {
    icon: Users,
    title: 'Gestione Multi-Scuola',
    description: 'Sistema multi-tenant per gestire più scuole da un unico pannello di controllo.',
  },
  {
    icon: Palette,
    title: 'Personalizzazione',
    description: "Aggiungi pagine personalizzate e adatta il sito all'identità della tua scuola.",
  },
  // {
  //   icon: BarChart3,
  //   title: 'Dashboard Analitica',
  //   description: 'Monitora le statistiche di utilizzo e coinvolgimento delle famiglie.',
  // },
  // {
  //   icon: Shield,
  //   title: 'Sicurezza e Privacy',
  //   description: 'Conformità GDPR, backup automatici e protezione dei dati sensibili.',
  // },
]

export function FeaturesSection({
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

  return (
    <section className="py-24 px-8 relative" id="features">
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tutto ciò di cui hai bisogno per gestire la tua scuola
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Una piattaforma completa e intuitiva progettata specificamente per scuole
            dell&apos;infanzia e primarie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <SpotlightCard key={index}>
                <div className="mb-4 text-primary">
                  <Icon size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </SpotlightCard>
            )
          })}
        </div>
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
