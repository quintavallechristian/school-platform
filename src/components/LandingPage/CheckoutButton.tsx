'use client'
import { useState } from 'react'
import { Button } from '../ui/button'

export default function CheckoutButton({
  priceId,
  schoolId,
  highlighted,
}: {
  priceId: string
  schoolId: string
  highlighted: boolean
}) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ priceId, schoolId }),
    })
    const data = await res.json()
    window.location.href = data.url // redirect al checkout
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      variant={highlighted ? 'default' : 'outline'}
    >
      {loading ? 'Reindirizzamento...' : 'Inizia Prova Gratuita'}
    </Button>
  )
}
