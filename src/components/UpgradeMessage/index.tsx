'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'

interface UpgradeMessageProps {
  requiredPlan: 'professional' | 'enterprise'
  featureName: string
  featureFlag?: string // Nome del campo nella scuola che controlla se la funzionalità è abilitata (es. 'showParentsArea')
}

type MessageType = 'none' | 'upgrade' | 'disabled'

export const UpgradeMessage: React.FC<UpgradeMessageProps> = ({ 
  requiredPlan, 
  featureName,
  featureFlag 
}) => {
  const { user } = useAuth()
  const [messageType, setMessageType] = useState<MessageType>('none')
  const [currentPlan, setCurrentPlan] = useState<string>('')
  const [schoolId, setSchoolId] = useState<string>('')

  useEffect(() => {
    const checkPlanAndFeature = async () => {
      console.log('Controllando piano e funzionalità')
      if (!user || !user.schools || user.schools.length === 0) {
        return
      }

      // Se l'utente è super-admin, non mostrare il messaggio
      if (user.role === 'super-admin') {
        setMessageType('none')
        return
      }

      try {
        // Ottieni la scuola dell'utente
        const currentSchoolId = typeof user.schools[0] === 'string' 
          ? user.schools[0] 
          : user.schools[0].id

        setSchoolId(currentSchoolId)

        const response = await fetch(`/api/schools/${currentSchoolId}`)
        const school = await response.json()

        const plan = school?.subscription?.plan || 'starter'
        setCurrentPlan(plan)

        // Controlla il piano
        const planHierarchy = { starter: 0, professional: 1, enterprise: 2 }
        const currentPlanLevel = planHierarchy[plan as keyof typeof planHierarchy] || 0
        const requiredPlanLevel = planHierarchy[requiredPlan]

        // Se il piano non è adeguato, mostra il messaggio di upgrade
        if (currentPlanLevel < requiredPlanLevel) {
          setMessageType('upgrade')
          return
        }

        // Se il piano è adeguato ma c'è un featureFlag da controllare
        if (featureFlag) {
          const isFeatureEnabled = school?.featureVisibility?.[featureFlag]
          
          // Se la funzionalità è disabilitata, mostra il messaggio di abilitazione
          if (!isFeatureEnabled) {
            setMessageType('disabled')
            return
          }
        }

        // Altrimenti non mostrare nessun messaggio
        setMessageType('none')
      } catch (error) {
        console.error('Error checking plan and feature:', error)
      }
    }
    checkPlanAndFeature()
  }, [user, requiredPlan, featureFlag])

  useEffect(() => {
    // Nascondi il pulsante "Create New" usando JavaScript DOM manipulation
    if (messageType !== 'none') {
      const hideButton = () => {
        // Cerca il pulsante "Crea Nuovo" in vari modi
        const buttons = document.querySelectorAll('a, button')
        buttons.forEach((button) => {
          const text = button.textContent?.trim().toLowerCase()
          
          // Nascondi se contiene "crea nuovo" o "create new"
          if (
            text?.includes('crea nuovo') ||
            text?.includes('create new')
          ) {
            ;(button as HTMLElement).style.display = 'none'
          }
        })
      }

      // Esegui subito
      hideButton()

      // Osserva cambiamenti nel DOM per nascondere il pulsante se viene aggiunto dinamicamente
      const observer = new MutationObserver(hideButton)
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      return () => {
        observer.disconnect()
      }
    }
  }, [messageType])

  if (messageType === 'none') {
    return null
  }

  const planNames = {
    professional: 'Professional',
    enterprise: 'Enterprise',
  }

  // Messaggio per piano inadeguato
  if (messageType === 'upgrade') {
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
  else if(messageType === 'disabled') {
    return (
      <div
        style={{
        padding: '2rem',
        margin: '2rem 4rem',
        backgroundColor: '#DBEAFE',
        border: '2px solid #3B82F6',
        borderRadius: '8px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1E40AF' }}>
        Funzionalità disabilitata
      </h2>
      <p style={{ fontSize: '1rem', color: '#1E3A8A', marginBottom: '1.5rem' }}>
        Abilitala nelle impostazioni scuola per poterla usare.
      </p>
      <Link
        href={`/admin/collections/schools/${schoolId}`}
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3B82F6',
          color: 'white',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3B82F6')}
      >
        Vai alle impostazioni scuola
      </Link>
    </div>
  )
}
}

export default UpgradeMessage

