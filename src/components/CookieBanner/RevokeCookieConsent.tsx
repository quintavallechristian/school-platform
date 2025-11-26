'use client'

import { useCookieConsent } from '@/hooks/useCookieConsent'
import { Button } from '../ui/button'

export default function RevokeCookieConsent() {
  const { revokeConsent } = useCookieConsent()

  const handleRevoke = () => {
    if (confirm('Sei sicuro di voler revocare il consenso? La pagina verrà ricaricata.')) {
      revokeConsent()
      window.location.reload()
    }
  }

  return (
    <Button onClick={handleRevoke} variant="destructive">
      Revoca Consenso Cookie
    </Button>
  )
}
