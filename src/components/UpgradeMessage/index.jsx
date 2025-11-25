'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export const UpgradeMessage = ({ requiredPlan, featureName, featureFlag }) => {
  const [messageType, setMessageType] = useState('none')
  const [currentPlan, setCurrentPlan] = useState('')
  const [schoolId, setSchoolId] = useState('')
  const [user, setUser] = useState(null)

  // Ottieni l'utente corrente tramite API invece di useAuth
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include',
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const checkPlanAndFeature = async () => {
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
        const currentPlanLevel = planHierarchy[plan] || 0
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
    
    if (user) {
      checkPlanAndFeature()
    }
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
            button.style.display = 'none'
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
  
  if (messageType === 'disabled') {
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
  
  return null
}

export default UpgradeMessage
