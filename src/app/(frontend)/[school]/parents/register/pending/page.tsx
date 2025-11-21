import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import Link from 'next/link'
import { CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function PendingPage(props: { params: Promise<{ school: string }> }) {
  const params = await props.params
  
  return (
    <div className="min-h-screen flex items-center justify-center py-24">
      <SpotlightCard className="w-full max-w-4xl">
        <div className="space-y-6 text-center">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-950/20 p-4">
              <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Richiesta Inviata!</h1>
            <p className="text-lg text-muted-foreground">
              La tua richiesta di registrazione è stata ricevuta con successo
            </p>
          </div>

          {/* Status Info */}
          <div className="space-y-4 rounded-lg border bg-muted/50 p-6 text-left">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 mt-0.5 text-primary" />
              <div className="space-y-1">
                <h3 className="font-semibold">In attesa di approvazione</h3>
                <p className="text-sm text-muted-foreground">
                  La tua richiesta è attualmente in fase di revisione da parte dello staff della scuola.
                  Questo processo richiede solitamente 1-2 giorni lavorativi.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3 rounded-lg border bg-blue-50 dark:bg-blue-950/20 p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Cosa succede ora?
            </h3>
            <ol className="space-y-2 text-left text-sm text-blue-800 dark:text-blue-200">
              <li className="flex gap-2">
                <span className="font-semibold">1.</span>
                <span>Lo staff della scuola riceverà la tua richiesta</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">2.</span>
                <span>Verificheranno i dati forniti</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">3.</span>
                <span>Riceverai una conferma dell&apos;approvazione</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">4.</span>
                <span>Potrai accedere all&apos;area genitori e visualizzare le informazioni del tuo bambino</span>
              </li>
            </ol>
          </div>

          {/* Support */}
          <div className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">
              Hai domande o non hai ricevuto conferma dopo alcuni giorni?
            </p>
            <p className="text-sm font-medium">
              Contatta la scuola direttamente per assistenza
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <Button asChild>
              <Link href={`/${params.school}`}>
                Torna alla Home
              </Link>
            </Button>
          </div>
        </div>
      </SpotlightCard>
    </div>
  )
}
