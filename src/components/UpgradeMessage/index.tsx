'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'

interface UpgradeMessageProps {
  requiredPlan: 'professional' | 'enterprise'
  featureName: string
}

export const UpgradeMessage: React.FC<UpgradeMessageProps> = ({ requiredPlan, featureName }) => {
  const { user } = useAuth()
  const [shouldShow, setShouldShow] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<string>('')

  useEffect(() => {
    const checkPlan = async () => {
      if (!user || !user.schools || user.schools.length === 0) {
        return
      }

      // Se l'utente è super-admin, non mostrare il messaggio
      if (user.role === 'super-admin') {
        setShouldShow(false)
        return
      }

      try {
        // Ottieni la scuola dell'utente
        const schoolId = typeof user.schools[0] === 'string' 
          ? user.schools[0] 
          : user.schools[0].id

        const response = await fetch(`/api/schools/${schoolId}`)
        const school = await response.json()

        const plan = school?.subscription?.plan || 'starter'
        setCurrentPlan(plan)

        // Mostra il messaggio solo se il piano corrente è inferiore a quello richiesto
        const planHierarchy = { starter: 0, professional: 1, enterprise: 2 }
        const currentPlanLevel = planHierarchy[plan as keyof typeof planHierarchy] || 0
        const requiredPlanLevel = planHierarchy[requiredPlan]

        setShouldShow(currentPlanLevel < requiredPlanLevel)
      } catch (error) {
        console.error('Error checking plan:', error)
      }
    }

    checkPlan()
  }, [user, requiredPlan])

  if (!shouldShow) {
    return null
  }

  const planNames = {
    professional: 'Professional',
    enterprise: 'Enterprise',
  }

  return (
    <div
      style={{
        padding: '2rem',
        margin: '2rem 4rem',
        backgroundColor: '#FEF3C7',
        border: '2px solid #F59E0B',
        borderRadius: '8px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#92400E' }}>
        Funzionalità non disponibile
      </h2>
      <p style={{ fontSize: '1rem', color: '#78350F', marginBottom: '1rem' }}>
        La funzionalità <strong>{featureName}</strong> richiede il piano <strong>{planNames[requiredPlan]}</strong>.
      </p>
      <p style={{ fontSize: '0.875rem', color: '#78350F', marginBottom: '1.5rem' }}>
        Il tuo piano attuale: <strong>{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</strong>
      </p>
      <Link
        href="/admin/collections/schools"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#F59E0B',
          color: 'white',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#D97706')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#F59E0B')}
      >
        Aggiorna al piano {planNames[requiredPlan]}
      </Link>
    </div>
  )
}

export default UpgradeMessage

