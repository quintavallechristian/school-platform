'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import './TermsAcceptanceBanner.css'

export const TermsAcceptanceBanner: React.FC = () => {
  const { user } = useAuth()
  const [needsAcceptance, setNeedsAcceptance] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [tosAccepted, setTosAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    console.log('TermsAcceptanceBanner mounted, user:', user)
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userData = user as any

      // TEMPORANEO: Forza la visualizzazione del banner per test
      const hasAccepted = false // Cambia in: userData.acceptedPrivacyPolicy === true && userData.acceptedTermsOfService === true

      console.log('User acceptance status:', {
        acceptedPrivacy: userData.acceptedPrivacyPolicy,
        acceptedTos: userData.acceptedTermsOfService,
        needsAcceptance: !hasAccepted,
        FORCED_FOR_TESTING: true,
      })

      setNeedsAcceptance(!hasAccepted)
    }
  }, [user])

  const handleAccept = async () => {
    if (!privacyAccepted || !tosAccepted || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/users/accept-terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Errore durante l'aggiornamento")
      }

      // Ricarica la pagina per aggiornare lo stato dell'utente
      window.location.reload()
    } catch (error) {
      console.error('Errore:', error)
      alert('Si è verificato un errore. Riprova.')
      setIsSubmitting(false)
    }
  }

  if (!needsAcceptance) {
    console.log('Not rendering banner - acceptance not needed')
    return null
  }

  console.log('Rendering terms acceptance banner')
  return (
    <div className="terms-acceptance-overlay">
      <div className="terms-acceptance-modal">
        <div className="terms-acceptance-header">
          <h2>Benvenuto! 👋</h2>
          <p>
            Prima di iniziare ad utilizzare la piattaforma, è necessario accettare i seguenti
            documenti:
          </p>
        </div>

        <div className="terms-acceptance-checkboxes">
          <label className="terms-checkbox-label">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="terms-checkbox"
            />
            <span>
              Ho letto e accetto la{' '}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </span>
          </label>

          <label className="terms-checkbox-label">
            <input
              type="checkbox"
              checked={tosAccepted}
              onChange={(e) => setTosAccepted(e.target.checked)}
              className="terms-checkbox"
            />
            <span>
              Ho letto e accetto i{' '}
              <a href="/tos" target="_blank" rel="noopener noreferrer">
                Termini di Servizio
              </a>
            </span>
          </label>
        </div>

        <button
          onClick={handleAccept}
          disabled={!privacyAccepted || !tosAccepted || isSubmitting}
          className="terms-accept-button"
        >
          {isSubmitting ? 'Accettazione in corso...' : 'Accetta e continua'}
        </button>

        <p className="terms-acceptance-note">
          Non potrai utilizzare la piattaforma senza accettare questi documenti.
        </p>
      </div>
    </div>
  )
}
