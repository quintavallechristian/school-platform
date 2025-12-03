'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { User } from '@/payload-types'
import './TermsAcceptanceBanner.css'

interface ParentsTermsGuardProps {
  children: React.ReactNode
  initialUser: User | null
  schoolSlug: string
}

export const ParentsTermsGuard: React.FC<ParentsTermsGuardProps> = ({
  children,
  initialUser,
  schoolSlug,
}) => {
  const [needsAcceptance, setNeedsAcceptance] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [tosAccepted, setTosAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (initialUser) {
      const hasAccepted =
        initialUser.acceptedPrivacyPolicy === true && initialUser.acceptedTermsOfService === true

      console.log('Parents area - User acceptance status:', {
        email: initialUser.email,
        acceptedPrivacy: initialUser.acceptedPrivacyPolicy,
        acceptedTos: initialUser.acceptedTermsOfService,
        needsAcceptance: !hasAccepted,
      })

      setNeedsAcceptance(!hasAccepted)
    }
  }, [initialUser])

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

  const modal =
    needsAcceptance && mounted ? (
      <div className="terms-acceptance-overlay">
        <div className="terms-acceptance-modal">
          <div className="terms-acceptance-header">
            <h2>Benvenuto! 👋</h2>
            <p>
              Prima di iniziare ad utilizzare l&apos;area genitori, è necessario accettare i
              seguenti documenti:
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
                <a href={`/${schoolSlug}/privacy-policy`} target="_blank" rel="noopener noreferrer">
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
                <a href={`/${schoolSlug}/tos`} target="_blank" rel="noopener noreferrer">
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
            Non potrai utilizzare l&apos;area genitori senza accettare questi documenti.
          </p>
        </div>
      </div>
    ) : null

  return (
    <>
      {children}
      {mounted && modal && createPortal(modal, document.body)}
    </>
  )
}
