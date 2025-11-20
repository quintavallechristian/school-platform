'use client'

import { useFormFields } from '@payloadcms/ui'
import { CheckboxField } from '@payloadcms/ui'

export const ConditionalCalendarCheckbox = () => {
  // Ottieni il valore della scuola dal form
  const school = useFormFields(([fields]) => fields.school)
  
  // Estrai l'ID della scuola
  const schoolId = typeof school?.value === 'string' ? school.value : school?.value?.id
  
  // Per ora, non possiamo fare una query asincrona qui per ottenere i dati della scuola
  // Quindi useremo un approccio diverso: mostreremo sempre la checkbox ma con un messaggio
  // La validazione vera sarà nel backend
  
  return (
    <div className="field-type checkbox">
      <CheckboxField
        name="addToCalendar"
        label="Vuoi aggiungere l'evento al calendario?"
        admin={{
          description: schoolId 
            ? 'Se abilitato, verrà creata automaticamente una entry nel calendario (se la feature è attiva per la tua scuola)'
            : 'Seleziona prima una scuola',
        }}
      />
    </div>
  )
}
