'use client'

import { Download, Shield, CheckCircle, FileText, Building2 } from 'lucide-react'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ParentRegisterPage() {
  const params = useParams()
  const school = params.school as string

  const handleDownloadForm = () => {
    // Apre il modulo in una nuova finestra per la stampa
    window.open('/modulo-registrazione-genitore.pdf', '_blank')
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4">
      <SpotlightCard className="w-full max-w-3xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Registrazione Genitore</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Accesso all&apos;area riservata genitori
            </p>
          </div>

          {/* Security Notice */}
          <div className="p-6 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-900 rounded-lg">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Procedura di Registrazione Sicura
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  Per garantire la massima sicurezza dei bambini e verificare l&apos;identità dei
                  genitori, la registrazione all&apos;area genitori avviene{' '}
                  <strong>esclusivamente di persona presso la scuola</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Come procedere</h2>

            <div className="grid gap-4">
              {/* Step 1 */}
              <div className="flex gap-4 p-5 bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                <div className="shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Scarica il modulo
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Scarica e stampa il modulo di registrazione cliccando sul pulsante qui sotto.
                  </p>
                  <Button onClick={handleDownloadForm} className="gap-2" size="sm">
                    <FileText className="h-4 w-4" />
                    Scarica Modulo (PDF)
                  </Button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 p-5 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <div className="shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Compila il modulo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Compila tutti i campi richiesti con i tuoi dati e quelli del bambino/a. Firma il
                    documento.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 p-5 bg-linear-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/20 rounded-lg border border-cyan-200 dark:border-cyan-900">
                <div className="shrink-0 w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Porta il modulo in segreteria
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Consegna il modulo compilato in segreteria insieme ad un{' '}
                    <strong>documento d&apos;identità valido</strong>. Il personale verificherà
                    l&apos;identità e la relazione con il bambino/a.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 p-5 bg-linear-to-r from-teal-50 to-green-50 dark:from-teal-950/20 dark:to-green-950/20 rounded-lg border border-teal-200 dark:border-teal-900">
                <div className="shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Ricevi le credenziali
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Dopo la verifica, riceverai via email le credenziali per accedere all&apos;area
                    riservata genitori.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900 rounded-lg">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-3 text-lg">
              ⚠️ Note Importanti
            </h3>
            <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  È necessario presentarsi <strong>di persona</strong> con un documento
                  d&apos;identità valido
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Solo i genitori o tutori legali possono richiedere l&apos;accesso</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Il bambino/a deve essere già iscritto alla scuola</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  L&apos;attivazione dell&apos;account può richiedere 1-2 giorni lavorativi
                </span>
              </li>
            </ul>
          </div>

          {/* Already have account */}
          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-3">Hai già un account?</p>
            <Link href={`/${school}/parents/login`}>
              <Button variant="outline" className="gap-2">
                Accedi all&apos;Area Genitori
              </Button>
            </Link>
          </div>
        </div>
      </SpotlightCard>
    </div>
  )
}
