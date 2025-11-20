'use client'

import { useFormFields, useField } from '@payloadcms/ui'
import { CheckboxField } from '@payloadcms/ui'
import React from 'react'

export const ConditionalCalendarCheckbox = () => {
  // Ottieni il valore della scuola dal form
  const school = useFormFields(([fields]) => fields.school)
  
  // Estrai l'ID della scuola
  const schoolId = typeof school?.value === 'string' ? school.value : (school?.value as { id: string })?.id
  
  const path = 'addToCalendar'
  const { value, setValue } = useField({ path })

  const description = schoolId 
    ? 'Se abilitato, verrà creata automaticamente una entry nel calendario (se la feature è attiva per la tua scuola)'
    : 'Seleziona prima una scuola'
  
  return (
    <div className="field-type checkbox">
      <CheckboxField
        path={path}
        checked={Boolean(value)}
        onChange={setValue}
        field={{
          name: 'addToCalendar',
          type: 'checkbox',
          label: "Vuoi aggiungere l'evento al calendario?",
          admin: {
            description,
            position: 'sidebar',
          },
        }}
      />
    </div>
  )
}
