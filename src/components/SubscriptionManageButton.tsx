'use client'
import { Button, useDocumentInfo } from '@payloadcms/ui'
import React from 'react'

interface SubscriptionData {
  stripeCustomerId?: string
  status?: string
}

const SubscriptionManageButton = () => {
  const { data } = useDocumentInfo()
  const subscriptionData = data as SubscriptionData | undefined

  const handleClick = async () => {
    if (!subscriptionData?.stripeCustomerId) {
      alert('Nessun abbonamento Stripe associato.')
      return
    }

    const res = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stripeCustomerId: subscriptionData.stripeCustomerId }),
    })

    const responseData = await res.json()

    if (responseData.url) {
      window.open(responseData.url, '_blank')
    } else {
      alert('Impossibile aprire il portale di fatturazione.')
    }
  }

  // Only show button if there's a Stripe customer ID
  if (subscriptionData?.status === 'trial') {
    return (
      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#eff6ff',
          borderRadius: '6px',
        }}
      >
        <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
          ℹ️ Abbonamento in Trial. Il portale di gestione Stripe sarà disponibile dopo il primo
          pagamento.
        </p>
      </div>
    )
  } else if (subscriptionData?.stripeCustomerId) {
    return (
      <div style={{ marginTop: '16px' }}>
        <Button buttonStyle="secondary" onClick={handleClick}>
          Gestisci Abbonamento tramite Stripe
        </Button>
      </div>
    )
  }
}

export default SubscriptionManageButton
