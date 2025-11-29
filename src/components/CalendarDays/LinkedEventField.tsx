'use client'

import React, { useEffect, useState } from 'react'
import { useFormFields, useAuth, RelationshipField } from '@payloadcms/ui'

export const LinkedEventField: React.FC = () => {
  const schoolField = useFormFields(([fields]) => fields.school)
  const typeField = useFormFields(([fields]) => fields.type)
  const { user } = useAuth()

  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Controlla se il tipo selezionato richiede un evento collegato
  const shouldShowField = typeField?.value === 'event'

  useEffect(() => {
    const checkFeature = async () => {
      setIsLoading(true)

      // Se il tipo non richiede un evento collegato, nascondi il campo
      if (!shouldShowField) {
        setIsFeatureEnabled(false)
        setIsLoading(false)
        return
      }

      // Determina quale scuola controllare
      let schoolId: string | null = null

      // Prima controlla se c'è una scuola selezionata nel form
      if (schoolField?.value) {
        schoolId =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          typeof schoolField.value === 'string' ? schoolField.value : (schoolField.value as any)?.id
      }
      // Se non c'è, ma l'utente ha una sola scuola, usa quella
      else if (user?.schools && Array.isArray(user.schools) && user.schools.length === 1) {
        const userSchool = user.schools[0]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schoolId = typeof userSchool === 'string' ? userSchool : (userSchool as any)?.id
      }

      // Se non c'è una scuola da controllare, disabilita il campo
      if (!schoolId) {
        setIsFeatureEnabled(false)
        setIsLoading(false)
        return
      }

      try {
        // Fetch school data to check feature flags
        const schoolResponse = await fetch(`/api/schools/${schoolId}`)

        if (!schoolResponse.ok) {
          throw new Error('Errore nel recupero dei dati della scuola')
        }

        const school = await schoolResponse.json()
        const eventsEnabled = school?.featureVisibility?.showEvents ?? false

        setIsFeatureEnabled(eventsEnabled)

        if (!eventsEnabled) {
          setIsFeatureEnabled(false)
        }
      } catch (error) {
        console.error('Errore durante il controllo della feature:', error)
        setIsFeatureEnabled(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkFeature()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolField?.value, user?.schools])

  // Se il tipo non richiede un evento collegato, non mostrare nulla
  if (!shouldShowField) {
    return null
  }

  // Se la feature non è abilitata, mostra solo il messaggio d'errore
  if (!isFeatureEnabled && !isLoading) {
    return <></>
  }

  // Se stiamo caricando, mostra un messaggio di caricamento
  if (isLoading) {
    return (
      <div className="field-type relationship">
        <label htmlFor="linkedEvent" className="field-label">
          Evento Collegato
        </label>
        <div style={{ marginTop: '8px', color: '#666' }}>Verifica in corso...</div>
      </div>
    )
  }

  // Se la feature è abilitata, mostra il campo relationship standard di Payload
  return (
    <RelationshipField
      path="linkedEvent"
      field={{
        name: 'linkedEvent',
        type: 'relationship',
        relationTo: 'events',
        label: 'Evento Collegato',
        admin: {
          description: 'Collega un evento per maggiori dettagli',
        },
      }}
    />
  )
}

export default LinkedEventField
