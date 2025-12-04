'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'

interface TrialExpiredModalProps {
  onActivate: () => void
  onLogout: () => void
  plan: string
  isTrial: boolean
}

const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({
  onActivate,
  onLogout,
  plan,
  isTrial,
}) => {
  const title = isTrial ? 'Trial Scaduto' : 'Abbonamento Scaduto'
  const message = isTrial
    ? "Il periodo di prova gratuito di 30 giorni è terminato. Per continuare a utilizzare la piattaforma e accedere all'area admin, è necessario attivare un abbonamento."
    : "L'abbonamento è scaduto. Per continuare a utilizzare la piattaforma e accedere all'area admin, è necessario rinnovare l'abbonamento."
  const actionText = isTrial ? 'Attiva Abbonamento' : 'Rinnova Abbonamento'
  const actionDescription = isTrial
    ? "Attiva ora il tuo abbonamento per riprendere l'accesso a tutte le funzionalità della piattaforma."
    : "Rinnova ora il tuo abbonamento per riprendere l'accesso a tutte le funzionalità della piattaforma."
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <svg
            style={{ width: '28px', height: '28px', color: '#dc2626' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#dc2626',
              margin: 0,
            }}
          >
            {title}
          </h2>
        </div>

        <p
          style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.6',
          }}
        >
          {message}
        </p>

        <div
          style={{
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <p
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '8px',
            }}
          >
            Piano: {plan}
          </p>
          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}
          >
            {actionDescription}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button
            onClick={onActivate}
            style={{
              width: '100%',
              padding: '14px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {actionText}
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href="/"
              style={{
                flex: 1,
                padding: '14px 24px',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
                boxSizing: 'border-box',
              }}
            >
              Torna alla Home
            </a>

            <button
              onClick={onLogout}
              style={{
                flex: 1,
                padding: '14px 24px',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
                boxSizing: 'border-box',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <p
          style={{
            fontSize: '13px',
            color: '#9ca3af',
            marginTop: '16px',
            textAlign: 'center',
            lineHeight: '1.5',
          }}
        >
          Non potrai accedere all&apos;area admin senza un abbonamento attivo.
        </p>
      </div>
    </div>
  )
}

export const AdminTrialGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [trialExpired, setTrialExpired] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [plan, setPlan] = useState('starter')
  const [isTrial, setIsTrial] = useState(true)
  const [schoolSlug, setSchoolSlug] = useState<string | null>(null)
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null)

  useEffect(() => {
    const checkTrialStatus = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      // Solo school-admin e super-admin devono essere controllati
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userData = user as any
      if (userData.role !== 'school-admin' && userData.role !== 'super-admin') {
        setIsLoading(false)
        return
      }

      // Super-admin non ha restrizioni
      if (userData.role === 'super-admin') {
        setIsLoading(false)
        return
      }

      // Per school-admin, controlla le sue scuole
      const schools = userData.schools || []
      if (schools.length === 0) {
        setIsLoading(false)
        return
      }

      try {
        // Controlla tutte le scuole dell'admin
        let hasActiveSchool = false

        for (const schoolRef of schools) {
          const schoolId = typeof schoolRef === 'string' ? schoolRef : schoolRef.id

          // Fetch school details
          const response = await fetch(`/api/schools/${schoolId}`, {
            credentials: 'include',
          })

          if (response.ok) {
            const schoolData = await response.json()

            // Controlla se la scuola è attiva e l'abbonamento non è scaduto
            if (schoolData.isActive) {
              const isTrialPlan = schoolData.subscription?.isTrial || false
              const expiresAt = schoolData.subscription?.expiresAt
              const renewsAt = schoolData.subscription?.renewsAt
              const now = new Date()

              // Check for renewal failure (renewsAt in past without expiresAt)
              if (renewsAt && !expiresAt) {
                const renewsAtDate = new Date(renewsAt)
                if (renewsAtDate < now) {
                  // Renewal failed - treat as expired
                  setPlan(schoolData.subscription?.plan || 'starter')
                  setIsTrial(false) // Not a trial, it's a failed renewal
                  setSchoolSlug(schoolData.slug)
                  setSelectedPriceId(schoolData.subscription?.selectedPriceId || null)
                  continue // Check next school
                } else {
                  // Active subscription that will renew
                  hasActiveSchool = true
                  break
                }
              }
              // Check if subscription is cancelled/expired
              else if (expiresAt) {
                const expirationDate = new Date(expiresAt)

                if (expirationDate > now) {
                  // Abbonamento ancora valido (ma cancellato, scadrà)
                  hasActiveSchool = true
                  break
                } else {
                  // Abbonamento scaduto (trial o pagato), salva le info per il modal
                  setPlan(schoolData.subscription?.plan || 'starter')
                  setIsTrial(isTrialPlan)
                  setSchoolSlug(schoolData.slug)
                  setSelectedPriceId(schoolData.subscription?.selectedPriceId || null)
                }
              } else {
                // Nessuna data di scadenza o rinnovo, considera la scuola attiva
                hasActiveSchool = true
                break
              }
            }
          }
        }

        setTrialExpired(!hasActiveSchool)
      } catch (error) {
        console.error('Error checking trial status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkTrialStatus()
  }, [user])

  const handleActivate = async () => {
    if (!schoolSlug || !selectedPriceId) {
      window.location.href = '/pricing'
      return
    }

    try {
      const response = await fetch('/api/activate-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug,
          priceId: selectedPriceId,
        }),
        credentials: 'include',
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
        credentials: 'include',
      })
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Mostra nulla durante il caricamento
  if (isLoading) {
    return null
  }

  // Se l'abbonamento è scaduto (trial o pagato), mostra il modal
  if (trialExpired) {
    return (
      <TrialExpiredModal
        onActivate={handleActivate}
        onLogout={handleLogout}
        plan={plan}
        isTrial={isTrial}
      />
    )
  }

  // Altrimenti mostra i children normalmente
  return <>{children}</>
}
