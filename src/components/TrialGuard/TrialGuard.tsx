'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertCircle, Clock } from 'lucide-react'

interface TrialGuardProps {
  schoolSlug: string
  children: React.ReactNode
  isAdmin?: boolean
}

interface TrialStatus {
  isActive: boolean
  isTrial: boolean
  expiresAt: string | null
  renewsAt?: string | null
  daysRemaining: number
  willRenew?: boolean
  renewalFailed?: boolean
  plan: string
  selectedPriceId: string | null
}

export function TrialGuard({ schoolSlug, children, isAdmin = false }: TrialGuardProps) {
  const router = useRouter()
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null)
  const [showExpiredModal, setShowExpiredModal] = useState(false)
  const [showWarningBanner, setShowWarningBanner] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkTrialStatus = async () => {
      try {
        const response = await fetch(`/api/schools/${schoolSlug}/trial-status`)
        if (response.ok) {
          const data = await response.json()
          setTrialStatus(data)

          // Mostra modal se:
          // 1. La scuola non è attiva
          // 2. Il trial è scaduto (isTrial && daysRemaining <= 0)
          // 3. L'abbonamento pagato è scaduto (!isTrial && daysRemaining <= 0)
          // 4. Il rinnovo è fallito (renewalFailed)
          const isExpired = !data.isActive || data.daysRemaining <= 0 || data.renewalFailed

          if (isExpired) {
            setShowExpiredModal(true)
          }
          // Se mancano 7 giorni o meno, mostra il banner di avviso (solo per trial o abbonamenti vicini a scadenza)
          else if (data.daysRemaining <= 7 && data.daysRemaining > 0) {
            setShowWarningBanner(true)
          }
        }
      } catch (error) {
        console.error('Error checking trial status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkTrialStatus()
    // Controlla ogni 5 minuti
    const interval = setInterval(checkTrialStatus, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [schoolSlug])

  const handleActivateSubscription = async () => {
    if (!trialStatus?.selectedPriceId) {
      router.push('/pricing')
      return
    }

    try {
      const response = await fetch('/api/activate-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug,
          priceId: trialStatus.selectedPriceId,
        }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        alert("Errore durante l'attivazione dell'abbonamento")
      }
    } catch (error) {
      console.error('Error activating subscription:', error)
      alert("Errore durante l'attivazione dell'abbonamento")
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
      })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return <>{children}</>
  }

  // Modal per trial scaduto - blocca l'accesso
  if (showExpiredModal && trialStatus) {
    // Messaggio diverso per admin e pubblico
    if (isAdmin) {
      // Determina il messaggio in base al tipo di scadenza
      const isTrialExpired = trialStatus.isTrial
      const isRenewalFailed = trialStatus.renewalFailed

      let title: string
      let message: string
      let actionText: string

      if (isRenewalFailed) {
        title = 'Problema con il Rinnovo'
        message =
          "Si è verificato un problema con il rinnovo automatico dell'abbonamento. Potrebbe essere dovuto a un pagamento fallito o a un altro errore. Per continuare a utilizzare la piattaforma, è necessario aggiornare il metodo di pagamento o rinnovare manualmente l'abbonamento."
        actionText = 'Aggiorna Pagamento'
      } else if (isTrialExpired) {
        title = 'Trial Scaduto'
        message =
          'Il periodo di prova gratuito di 30 giorni è terminato. Per continuare a utilizzare la piattaforma, è necessario attivare un abbonamento.'
        actionText = 'Attiva Abbonamento'
      } else {
        title = 'Abbonamento Scaduto'
        message =
          "L'abbonamento è scaduto. Per continuare a utilizzare la piattaforma, è necessario rinnovare l'abbonamento."
        actionText = 'Rinnova Abbonamento'
      }

      // Modal per amministratori - mostra dettagli abbonamento
      return (
        <Dialog open={showExpiredModal} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle id="trial-dialog-title" className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
                {title}
              </DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-4 pt-4">
                  <p>{message}</p>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-semibold mb-2">Piano: {trialStatus.plan}</p>
                    <p className="text-sm text-muted-foreground">
                      {isTrialExpired
                        ? "Attiva ora il tuo abbonamento per riprendere l'accesso a tutte le funzionalità della piattaforma."
                        : "Rinnova ora il tuo abbonamento per riprendere l'accesso a tutte le funzionalità della piattaforma."}
                    </p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="w-full space-y-2">
                <Button className="w-full" onClick={handleActivateSubscription}>
                  {actionText}
                </Button>
                <Button className="w-full" size="sm" variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    } else {
      // Modal per utenti pubblici - messaggio generico senza dettagli abbonamento
      return (
        <Dialog open={showExpiredModal} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle
                id="public-dialog-title"
                className="flex items-center gap-2 text-blue-600"
              >
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
                Sito Temporaneamente Non Disponibile
              </DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-4 pt-4">
                  <p>
                    Ci scusiamo per il disagio. Il sito è temporaneamente non disponibile per
                    manutenzione.
                  </p>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Ti preghiamo di riprovare più tardi. Per informazioni urgenti, contatta
                      direttamente la scuola.
                    </p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
    }
  }

  return (
    <>
      {/* Banner di avviso per trial in scadenza - solo per admin */}
      {isAdmin && showWarningBanner && trialStatus && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Clock
                  className="h-5 w-5 text-yellow-600 dark:text-yellow-500"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                    {trialStatus.isTrial
                      ? `Il tuo trial scade tra ${trialStatus.daysRemaining}`
                      : `Il tuo abbonamento scade tra ${trialStatus.daysRemaining}`}{' '}
                    {trialStatus.daysRemaining === 1 ? 'giorno' : 'giorni'}
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {trialStatus.isTrial
                      ? 'Attiva il tuo abbonamento per continuare a utilizzare la piattaforma'
                      : 'Rinnova il tuo abbonamento per continuare a utilizzare la piattaforma'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowWarningBanner(false)}
                  className="border-yellow-300 dark:border-yellow-700"
                >
                  Ricordamelo dopo
                </Button>
                <Button size="sm" onClick={handleActivateSubscription}>
                  {trialStatus.isTrial ? 'Attiva Ora' : 'Rinnova Ora'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  )
}
