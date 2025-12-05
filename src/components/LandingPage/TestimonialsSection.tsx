'use client'

import React, { useState, useEffect } from 'react'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { GraduationCap, Briefcase, User } from 'lucide-react'
import ShapeDivider, { ShapeDividerStyle } from '../ShapeDivider/ShapeDivider'

const testimonials = [
  {
    name: 'Maria Rossi',
    role: 'Dirigente Scolastico',
    school: 'Scuola Infanzia San Giuseppe',
    content:
      'Questa piattaforma ha rivoluzionato la nostra comunicazione con le famiglie. Finalmente abbiamo tutto centralizzato in un unico posto!',
    icon: GraduationCap,
  },
  {
    name: 'Luca Bianchi',
    role: 'Coordinatore Didattico',
    school: 'Istituto Comprensivo Manzoni',
    content:
      "La facilità d'uso è impressionante. Anche i genitori meno tecnologici riescono a seguire tutte le attività dei loro bambini.",
    icon: Briefcase,
  },
  {
    name: 'Anna Verdi',
    role: 'Insegnante',
    school: 'Scuola Primaria Rodari',
    content:
      'Adoro la funzione galleria! Posso condividere foto delle nostre attività in modo sicuro e le famiglie apprezzano moltissimo.',
    icon: User,
  },
]

const faqs = [
  {
    question: 'Come funziona il periodo di prova gratuito?',
    answer:
      'Puoi provare gratuitamente la piattaforma per 30 giorni senza inserire carta di credito. Al termine del periodo potrai scegliere il piano più adatto alle tue esigenze.',
  },
  {
    question: 'Posso cambiare piano in qualsiasi momento?',
    answer:
      'Assolutamente sì! Puoi fare upgrade o downgrade in qualsiasi momento. I costi verranno ripartiti proporzionalmente.',
  },
  {
    question: 'I dati delle famiglie sono al sicuro?',
    answer:
      'La sicurezza è la nostra priorità. Tutti i dati sono crittografati, facciamo backup giornalieri e siamo completamente conformi al GDPR.',
  },
  {
    question: 'Quanto tempo serve per configurare la piattaforma?',
    answer:
      "La configurazione base richiede solo 15-20 minuti. Il nostro team ti supporterà durante l'onboarding per personalizzare tutto secondo le tue esigenze.",
  },
  {
    question: 'Offrite formazione per il personale?',
    answer:
      'Sì! Tutti i piani includono materiale formativo e video tutorial. I piani Professional ed Enterprise includono anche sessioni di formazione personalizzate.',
  },
  {
    question: 'Posso gestire più plessi scolastici?',
    answer:
      'Il piano Enterprise è progettato specificamente per gestire più scuole o plessi con un unico pannello di controllo centralizzato.',
  },
]

export function TestimonialsSection({
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
    <section className="py-24 px-8 relative">
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
            Cosa dicono le scuole che ci hanno scelto
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Oltre 100 scuole in tutta Italia si affidano alla nostra piattaforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {testimonials.map((testimonial, index) => {
            const Icon = testimonial.icon
            return (
              <SpotlightCard key={index}>
                <div className="mb-4 text-primary">
                  <Icon size={48} strokeWidth={1.5} />
                </div>
                <p className="text-lg mb-6 italic">&quot;{testimonial.content}&quot;</p>
                <div className="mt-auto">
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-xs text-muted-foreground mt-1">{testimonial.school}</div>
                </div>
              </SpotlightCard>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Domande Frequenti</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tutto quello che devi sapere sulla nostra piattaforma
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <SpotlightCard key={index}>
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </SpotlightCard>
            ))}
          </div>
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
