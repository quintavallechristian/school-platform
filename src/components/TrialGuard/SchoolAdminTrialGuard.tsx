'use client'

import { TrialGuard } from '@/components/TrialGuard/TrialGuard'
import { usePayloadUser } from '@/hooks/usePayloadUser'
interface SchoolAdminTrialGuardProps {
  schoolSlug: string
  children: React.ReactNode
}

export function SchoolAdminTrialGuard({ schoolSlug, children }: SchoolAdminTrialGuardProps) {
  const { user, loading } = usePayloadUser()

  // Non applicare il guard alle pagine pubbliche o durante il caricamento
  if (loading) {
    return <>{children}</>
  }

  // Applica il guard solo per school-admin e super-admin che stanno visualizzando l'admin panel
  const shouldApplyGuard = user && (user.role === 'school-admin' || user.role === 'super-admin')

  if (!shouldApplyGuard) {
    // Per utenti pubblici, applica il guard ma senza mostrare dettagli admin
    return (
      <TrialGuard schoolSlug={schoolSlug} isAdmin={false}>
        {children}
      </TrialGuard>
    )
  }

  // Per admin, mostra il modal con i dettagli completi
  return (
    <TrialGuard schoolSlug={schoolSlug} isAdmin={true}>
      {children}
    </TrialGuard>
  )
}
