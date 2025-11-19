'use client'
import { Button, useDocumentInfo } from '@payloadcms/ui'
import React from 'react'

const ChangePlanPortalButton = () => {
  const { data: schoolData } = useDocumentInfo()
  console.log(schoolData)

  const handleClick = async () => {
    if (!schoolData) {
      return ''
    }
    const res = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ stripeCustomerId: schoolData.subscription.stripeCustomerId }),
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Impossibile aprire il portale di fatturazione.')
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <Button buttonStyle="secondary" onClick={handleClick}>
        Gestisci Abbonamento su Stripe
      </Button>
    </div>
  )
}

export default ChangePlanPortalButton
