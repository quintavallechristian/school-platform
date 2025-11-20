'use client'
import { Button, useDocumentInfo } from '@payloadcms/ui'
import React from 'react'

const ChangePlanPortalButton = ({ title }: { title: string }) => {
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
      window.open(data.url, '_blank')
    } else {
      alert('Impossibile aprire il portale di fatturazione.')
    }
  }

  return (
    <div>
      <Button buttonStyle="secondary" onClick={handleClick}>
        {title || 'Gestisci Abbonamento'}
      </Button>
    </div>
  )
}

export default ChangePlanPortalButton
