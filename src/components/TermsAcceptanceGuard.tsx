'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import { Label } from './ui/label'

interface AcceptanceModalProps {
  onAccept: () => void
}

const AcceptanceModal: React.FC<AcceptanceModalProps> = ({ onAccept }) => {
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [tosAccepted, setTosAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = privacyAccepted && tosAccepted && !isSubmitting

  const handleSubmit = async () => {
    if (!canSubmit) return

    setIsSubmitting(true)
    try {
      await onAccept()
    } catch (error) {
      console.error("Errore durante l'accettazione:", error)
      alert('Si è verificato un errore. Riprova.')
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#1f2937',
          }}
        >
          Benvenuto! 👋
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.6',
          }}
        >
          Prima di iniziare ad utilizzare la piattaforma, è necessario accettare i seguenti
          documenti:
        </p>

        <div
          style={{
            backgroundColor: '#f9fafb',
            borderRadius: '6px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <Label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              style={{
                marginRight: '12px',
                marginTop: '4px',
                width: '18px',
                height: '18px',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6' }}>
              Ho letto e accetto la{' '}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'underline',
                  fontWeight: '500',
                }}
              >
                Privacy Policy
              </a>
            </span>
          </Label>

          <Label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={tosAccepted}
              onChange={(e) => setTosAccepted(e.target.checked)}
              style={{
                marginRight: '12px',
                marginTop: '4px',
                width: '18px',
                height: '18px',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6' }}>
              Ho letto e accetto i{' '}
              <a
                href="/tos"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'underline',
                  fontWeight: '500',
                }}
              >
                Termini di Servizio
              </a>
            </span>
          </Label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%',
            padding: '14px 24px',
            backgroundColor: canSubmit ? '#3b82f6' : '#d1d5db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {isSubmitting ? 'Accettazione in corso...' : 'Accetta e continua'}
        </button>

        <p
          style={{
            fontSize: '13px',
            color: '#9ca3af',
            marginTop: '16px',
            textAlign: 'center',
            lineHeight: '1.5',
          }}
        >
          Non potrai utilizzare la piattaforma senza accettare questi documenti.
        </p>
      </div>
    </div>
  )
}

export const TermsAcceptanceGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [needsAcceptance, setNeedsAcceptance] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      // Controlla se l'utente ha già accettato
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userData = user as any
      const hasAccepted =
        userData.acceptedPrivacyPolicy === true && userData.acceptedTermsOfService === true

      setNeedsAcceptance(!hasAccepted)
      setIsLoading(false)
    } else {
      // Se non c'è utente, non mostrare il modal
      setNeedsAcceptance(false)
      setIsLoading(false)
    }
  }, [user])

  const handleAcceptance = async () => {
    if (!user?.id) return

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
      throw error
    }
  }

  // Mostra nulla durante il caricamento
  if (isLoading) {
    return null
  }

  // Se l'utente ha bisogno di accettare, mostra il modal
  if (needsAcceptance) {
    return <AcceptanceModal onAccept={handleAcceptance} />
  }

  // Altrimenti mostra i children normalmente
  return <>{children}</>
}
