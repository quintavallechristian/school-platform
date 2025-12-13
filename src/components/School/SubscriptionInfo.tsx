'use client'
import React, { useEffect, useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

interface SubscriptionData {
  id: string
  plan: string
  status: string
  trialEndsAt?: string
  renewsAt?: string
  expiresAt?: string
  stripeCustomerId?: string
}

interface SchoolData {
  subscription?: string | SubscriptionData
}

const statusLabels: Record<string, { label: string; color: string }> = {
  trial: { label: 'Trial', color: '#f59e0b' },
  active: { label: 'Attivo', color: '#10b981' },
  cancelled: { label: 'Cancellato', color: '#ef4444' },
  expired: { label: 'Scaduto', color: '#6b7280' },
}

const planLabels: Record<string, string> = {
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const SubscriptionInfo: React.FC = () => {
  const { data } = useDocumentInfo()
  const schoolData = data as SchoolData | undefined
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!schoolData?.subscription) {
        setLoading(false)
        return
      }

      // If subscription is already an object, use it
      if (typeof schoolData.subscription === 'object') {
        setSubscription(schoolData.subscription)
        setLoading(false)
        return
      }

      // Otherwise fetch the subscription data
      try {
        const res = await fetch(`/api/subscriptions/${schoolData.subscription}`, {
          credentials: 'include',
        })
        if (res.ok) {
          const subData = await res.json()
          setSubscription(subData)
        }
      } catch (error) {
        console.error('Error fetching subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [schoolData?.subscription])

  if (loading) {
    return (
      <div style={{ padding: '16px', color: '#6b7280' }}>
        Caricamento informazioni abbonamento...
      </div>
    )
  }

  if (!subscription) {
    return (
      <div
        style={{
          padding: '16px',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #fcd34d',
        }}
      >
        <p style={{ margin: 0, color: '#92400e' }}>
          ⚠️ Nessun abbonamento associato a questa scuola.
        </p>
      </div>
    )
  }

  const statusInfo = statusLabels[subscription.status] || statusLabels.expired

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Informazioni Abbonamento</h4>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: statusInfo.color,
            color: 'white',
          }}
        >
          {statusInfo.label}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
            PIANO
          </p>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
            {planLabels[subscription.plan] || subscription.plan}
          </p>
        </div>

        {subscription.status === 'trial' && subscription.trialEndsAt && (
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
              FINE TRIAL
            </p>
            <p style={{ margin: 0, fontSize: '14px' }}>{formatDate(subscription.trialEndsAt)}</p>
          </div>
        )}

        {subscription.renewsAt && (
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
              PROSSIMO RINNOVO
            </p>
            <p style={{ margin: 0, fontSize: '14px' }}>{formatDate(subscription.renewsAt)}</p>
          </div>
        )}

        {subscription.expiresAt && (
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
              SCADENZA
            </p>
            <p style={{ margin: 0, fontSize: '14px' }}>{formatDate(subscription.expiresAt)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionInfo
