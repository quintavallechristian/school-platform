'use client'

import { useField, useDocumentInfo } from '@payloadcms/ui'
import React from 'react'
import type { GroupFieldClientComponent } from 'payload'
import ChangePlanPortalButton from '../ChangePlanPortalButton'

const FeatureVisibilityField: GroupFieldClientComponent = ({ path }) => {
  // Use useDocumentInfo to access the actual document data
  const { data: schoolData } = useDocumentInfo()
  
  // Extract the plan from the subscription group
  const plan = (schoolData?.subscription?.plan as string) || 'starter'

  // Define feature groups
  const features = {
    starter: [
      { name: 'showChiSiamo', label: 'Chi Siamo' },
      { name: 'showBlog', label: 'Blog' },
      { name: 'showEvents', label: 'Eventi' },
      { name: 'showDocuments', label: 'Documenti' },
    ],
    professional: [
      { name: 'showProjects', label: 'Progetti (PRO)' },
      { name: 'showEducationalOfferings', label: 'Piano Offerta Formativa (PRO)' },
      { name: 'showCalendar', label: 'Calendario (PRO)' },
      { name: 'showMenu', label: 'Mensa (PRO)' },
      { name: 'showParentsArea', label: 'Area Riservata Genitori (PRO)' },
    ],
    enterprise: [
      { name: 'showCommunications', label: 'Comunicazioni (ENT)' },
    ],
  }

  // Determine included and additional features based on plan
  let includedFeatures: typeof features.starter = []
  let additionalFeatures: typeof features.starter = []

  switch (plan) {
    case 'enterprise':
      includedFeatures = [
        ...features.starter,
        ...features.professional,
        ...features.enterprise,
      ]
      additionalFeatures = []
      break
    case 'professional':
      includedFeatures = [...features.starter, ...features.professional]
      additionalFeatures = [...features.enterprise]
      break
    case 'starter':
    default:
      includedFeatures = [...features.starter]
      additionalFeatures = [...features.professional, ...features.enterprise]
      break
  }

  // Helper component for a single checkbox
  const FeatureCheckbox = ({ name, label, disabled }: { name: string; label: string; disabled?: boolean }) => {
    const fieldPath = path ? `${path}.${name}` : name
    const { value, setValue } = useField<boolean>({ path: fieldPath })

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '10px',
          width: '33%',
          paddingRight: '10px',
        }}
      >
        <input
          type="checkbox"
          id={fieldPath}
          checked={Boolean(value)}
          onChange={(e) => setValue(e.target.checked)}
          disabled={disabled}
          style={{
            marginRight: '10px',
            width: '18px',
            height: '18px',
            cursor: 'pointer',
          }}
        />
        <label htmlFor={fieldPath} style={{ cursor: 'pointer', userSelect: 'none' }}>
          {label}
        </label>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px', color: 'var(--theme-success-500)' }}>
          Funzionalità Incluse nel tuo piano ({plan})
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', paddingTop: '20px' }}>
          {includedFeatures.map((f) => (
            <FeatureCheckbox key={f.name} name={f.name} label={f.label} />
          ))}
        </div>
        {includedFeatures.length === 0 && (
          <p style={{ fontStyle: 'italic', color: '#888' }}>Nessuna funzionalità inclusa.</p>
        )}
      </div>

      {additionalFeatures.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: 'var(--theme-elevation-50)',
            border: '1px solid var(--theme-elevation-150)',
          }}
        >
          <h3 style={{ marginBottom: '10px', color: 'var(--theme-elevation-400)' }}>
            Funzionalità Aggiuntive (Non incluse nel piano)
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', opacity: 0.7, paddingTop: '20px' }}>
            {additionalFeatures.map((f) => (
              <FeatureCheckbox key={f.name} name={f.name} label={f.label} disabled />
            ))}
          </div>
          <ChangePlanPortalButton title="Aggiungi Funzionalità" />
        </div>
      )}
    </div>
  )
}

export default FeatureVisibilityField
