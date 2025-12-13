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
    console.log('Qua')
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
        const currentSchoolId =
          typeof user.schools[0] === 'string' ? user.schools[0] : user.schools[0].id

        setSchoolId(currentSchoolId)

        const response = await fetch(`/api/schools/${currentSchoolId}`)
        const school = await response.json()

        const plan = school?.subscription?.plan || 'starter'
        setCurrentPlan(plan)
        console.log('User plan:', plan)

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
    console.log('Quick')
    // Nascondi il pulsante "Create New" usando JavaScript DOM manipulation
    if (messageType !== 'none') {
      const hideButton = () => {
        // Cerca il pulsante "Crea Nuovo" in vari modi
        const buttons = document.querySelectorAll('a, button')
        buttons.forEach((button) => {
          const text = button.textContent?.trim().toLowerCase()

          // Nascondi se contiene "crea nuovo" o "create new"
          if (text?.includes('crea nuovo') || text?.includes('create new')) {
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
    console.log('Rendering upgrade message')
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-8 rounded-lg relative mx-4 md:mx-16 my-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-2 text-yellow-900">Funzionalità non disponibile</h2>
        <p className="text-base text-yellow-900 mb-4">
          La funzionalità <strong>{featureName}</strong> richiede il piano{' '}
          <strong>{planNames[requiredPlan]}</strong>.
        </p>
        <p className="text-sm text-yellow-900 mb-6">
          Il tuo piano attuale:{' '}
          <strong>{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</strong>
        </p>
        <Link
          href="/admin/collections/schools"
          className="inline-block px-6 py-3 bg-amber-500 text-white rounded-md font-semibold 
             hover:bg-amber-600 transition-colors no-underline hover:no-underline"
        >
          Aggiorna al piano {planNames[requiredPlan]}
        </Link>
      </div>
    )
  }

  if (messageType === 'disabled') {
    return (
      <div className="bg-blue-100 border border-blue-500 text-blue-900 px-4 py-8 rounded-lg mx-4 md:mx-16 my-8 text-center">
        <div className="text-5xl mb-4">⚙️</div>
        <h2 className="text-2xl font-bold mb-2 text-blue-800">Funzionalità disabilitata</h2>
        <p className="text-base text-blue-900 mb-6">
          Abilitala nelle impostazioni scuola per poterla usare.
        </p>
        <Link
          href={`/admin/collections/schools/${schoolId}`}
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-colors  no-underline hover:no-underline"
        >
          Vai alle impostazioni scuola
        </Link>
      </div>
    )
  }

  return null
}

export default UpgradeMessage
