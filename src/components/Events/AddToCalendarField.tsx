'use client'

import React, { useEffect, useState } from 'react'
import { useField, useFormFields, useAuth } from '@payloadcms/ui'

export const AddToCalendarField: React.FC = () => {
  const schoolField = useFormFields(([fields]) => fields.school)
  const { user } = useAuth()

  // Usa useField per avere accesso a setValue
  const { value, setValue } = useField<boolean>({ path: 'addToCalendar' })

  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const checkFeature = async () => {
      setIsLoading(true)
      setErrorMessage('')

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
        setErrorMessage('Seleziona prima una scuola')
        setIsLoading(false)
        return
      }

      try {
        // Fetch school data to check feature flags
        const response = await fetch(`/api/schools/${schoolId}`)

        if (!response.ok) {
          throw new Error('Errore nel recupero dei dati della scuola')
        }

        const school = await response.json()
        const calendarEnabled = school?.featureVisibility?.showCalendar ?? false

        setIsFeatureEnabled(calendarEnabled)

        if (!calendarEnabled) {
          setErrorMessage('Attiva il calendario nelle impostazioni della scuola.')
          // Se la feature è disabilitata e il campo è true, resettalo
          if (value) {
            setValue(false)
          }
        }
      } catch (error) {
        console.error('Errore durante il controllo della feature:', error)
        setIsFeatureEnabled(false)
        setErrorMessage('Errore durante la verifica della funzionalità')
      } finally {
        setIsLoading(false)
      }
    }

    checkFeature()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolField?.value, user?.schools])

  const handleChange = (checked: boolean) => {
    if (isFeatureEnabled) {
      setValue(checked)
    }
  }

  return (
    <div className="field-type checkbox">
      <div style={{ marginTop: '8px' }}>
        <input
          id="addToCalendar"
          name="addToCalendar"
          type="checkbox"
          checked={value || false}
          onChange={(e) => handleChange(e.target.checked)}
          disabled={isLoading || !isFeatureEnabled}
          style={{
            marginRight: '8px',
            cursor: isLoading || !isFeatureEnabled ? 'not-allowed' : 'pointer',
          }}
        />
        <span
          style={{
            color: isLoading || !isFeatureEnabled ? '#999' : 'inherit',
            fontSize: '14px',
          }}
        >
          {isLoading ? 'Verifica in corso...' : 'Aggiungi al calendario'}
        </span>
      </div>

      <div
        className="field-description"
        style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}
      >
        Se abilitato, verrà creata automaticamente una entry nel calendario collegata a questo
        evento
      </div>

      {errorMessage && (
        <div
          style={{
            marginTop: '8px',
            padding: '8px 12px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#856404',
          }}
        >
          ⚠️ {errorMessage}
        </div>
      )}
    </div>
  )
}

export default AddToCalendarField
