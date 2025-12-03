'use client'

import React, { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'

const faqs = [
  {
    category: 'Generale',
    questions: [
      {
        question: "Cos'è ScuoleInfanzia?",
        answer:
          "ScuoleInfanzia è una piattaforma digitale completa progettata per semplificare la gestione e la comunicazione nelle scuole dell'infanzia. Offre strumenti per la pubblicazione di contenuti, la gestione degli eventi, la comunicazione con i genitori e molto altro.",
      },
      {
        question: 'Chi può utilizzare ScuoleInfanzia?',
        answer:
          "La piattaforma è pensata per scuole dell'infanzia, asili nido, e strutture educative per la prima infanzia. Possono utilizzarla amministratori, insegnanti e genitori, ciascuno con le proprie funzionalità dedicate.",
      },
      {
        question: 'È necessaria esperienza tecnica per utilizzare la piattaforma?',
        answer:
          'No, ScuoleInfanzia è progettata per essere intuitiva e facile da usare. Non sono necessarie competenze tecniche particolari. Offriamo inoltre formazione e supporto per aiutarti a iniziare.',
      },
    ],
  },
  {
    category: 'Prezzi e Piani',
    questions: [
      {
        question: 'Quali piani tariffari sono disponibili?',
        answer:
          'Offriamo tre piani principali: Starter (49€/mese con funzionalità base), Professional (29€/mese con funzionalità avanzate) e Enterprise (personalizzato per scuole con esigenze specifiche). Tutti i piani includono una prova gratuita di 30 giorni.',
      },
      {
        question: 'Posso cambiare piano in qualsiasi momento?',
        answer:
          "Sì, puoi effettuare l'upgrade o il downgrade del tuo piano in qualsiasi momento. Le modifiche saranno effettive dal prossimo ciclo di fatturazione.",
      },
      {
        question: 'È necessaria una carta di credito per la prova gratuita?',
        answer:
          'No, puoi iniziare la prova gratuita di 30 giorni senza fornire alcun dato di pagamento. Ti chiederemo di inserire i dettagli di pagamento solo se deciderai di continuare dopo il periodo di prova.',
      },
      {
        question: 'Ci sono costi nascosti?',
        answer:
          'No, i nostri prezzi sono trasparenti. Il piano che scegli include tutte le funzionalità descritte senza costi aggiuntivi. Nel caso in cui tu abbia esigenze aggiuntive, le discuteremo insieme e ti forniremo un preventivo chiaro.',
      },
    ],
  },
  {
    category: 'Sicurezza e Privacy',
    questions: [
      {
        question: 'I dati degli utenti sono al sicuro?',
        answer:
          'Assolutamente sì. Utilizziamo le migliori pratiche di sicurezza, inclusa la crittografia dei dati, backup regolari e server sicuri. Siamo conformi al GDPR e alle normative sulla privacy.',
      },
      {
        question: 'Chi può accedere ai dati degli studenti?',
        answer:
          'Solo il personale autorizzato della scuola e i genitori/tutori legali possono accedere ai dati degli studenti. Ogni utente ha accesso solo alle informazioni pertinenti al proprio ruolo.',
      },
      {
        question: 'Come vengono gestiti i consensi privacy?',
        answer:
          'La piattaforma include un sistema completo di gestione dei consensi, permettendo ai genitori di accettare termini di servizio e policy sulla privacy. Tutti i consensi sono tracciati e documentati.',
      },
    ],
  },
  {
    category: 'Supporto Tecnico',
    questions: [
      {
        question: 'Offrite formazione per gli insegnanti?',
        answer:
          'Sì, il piano Enterprise offre sessioni di formazione online per aiutare il tuo team a familiarizzare con la piattaforma.',
      },
      {
        question: 'Quanto tempo ci vuole per configurare la piattaforma?',
        answer:
          'La configurazione base può essere completata in pochi minuti senza il bisogno di aiuto. Il nostro scopo è abilitare chiunque a utilizzare la piattaforma in modo autonomo mediante un linguaggio chiaro e adattato al mondo scolastico. Per configurazioni più complesse, il nostro team è disponibile per assistenza.',
      },
    ],
  },
]

export function FAQContent() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="py-8">
      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <p className="text-muted-foreground text-center mb-8">
          Trova le risposte alle domande più frequenti sulla nostra piattaforma.
        </p>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Cerca nelle FAQ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* FAQ Accordion */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-8">
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                    <AccordionTrigger className="text-left text-lg">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nessuna FAQ trovata per la tua ricerca. Prova con altri termini.
          </p>
        </div>
      )}

      {/* Contact CTA */}
      <div className="mt-12 p-6 bg-muted/50 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Non hai trovato quello che cercavi?</h3>
        <p className="text-muted-foreground mb-4">
          Il nostro team è qui per aiutarti. Contattaci per qualsiasi domanda o supporto.
        </p>
        <Link
          href="/contatti"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Contattaci
        </Link>
      </div>
    </div>
  )
}
