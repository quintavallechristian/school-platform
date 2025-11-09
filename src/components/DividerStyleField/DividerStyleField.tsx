'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import type { SelectField } from 'payload'

// Importa i path SVG dal componente ShapeDivider
const shapePaths: Record<string, string> = {
  wave: 'M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z',
  'wave-brush':
    'M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z',
  waves:
    'M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z',
  zigzag:
    'M0,0 L50,100 L100,0 L150,100 L200,0 L250,100 L300,0 L350,100 L400,0 L450,100 L500,0 L550,100 L600,0 L650,100 L700,0 L750,100 L800,0 L850,100 L900,0 L950,100 L1000,0 L1050,100 L1100,0 L1150,100 L1200,0 V120 H0 Z',
  triangle: 'M0,0 L600,100 L1200,0 V120 H0 Z',
  'triangle-asymmetric': 'M0,0 L900,100 L1200,0 V120 H0 Z',
  curve: 'M0,0 Q600,100 1200,0 V120 H0 Z',
  'curve-asymmetric': 'M0,0 Q800,100 1200,0 V120 H0 Z',
  tilt: 'M0,0 L1200,100 V120 H0 Z',
  arrow: 'M0,0 L600,100 L1200,0 L1050,50 L600,120 L150,50 Z',
  split: 'M0,0 L600,50 L1200,0 V120 H600 V70 L0,120 Z',
  clouds:
    'M0,100 Q150,50 300,80 T600,90 T900,70 T1200,90 V120 H0 Z M0,120 Q200,70 400,95 T800,85 T1200,100 V120 H0 Z',
  mountains:
    'M0,100 L200,50 L400,70 L600,30 L800,60 L1000,40 L1200,80 V120 H0 Z M0,120 L150,90 L300,100 L450,80 L600,95 L750,85 L900,95 L1050,88 L1200,100 V120 H0 Z',
}

const options = [
  { label: 'Onda', value: 'wave' },
  { label: 'Onda Pennellata', value: 'wave-brush' },
  { label: 'Onde Multiple', value: 'waves' },
  { label: 'Zigzag', value: 'zigzag' },
  { label: 'Triangolo', value: 'triangle' },
  { label: 'Triangolo Asimmetrico', value: 'triangle-asymmetric' },
  { label: 'Curva', value: 'curve' },
  { label: 'Curva Asimmetrica', value: 'curve-asymmetric' },
  { label: 'Inclinato', value: 'tilt' },
  { label: 'Freccia', value: 'arrow' },
  { label: 'Divisione', value: 'split' },
  { label: 'Nuvole', value: 'clouds' },
  { label: 'Montagne', value: 'mountains' },
]

type Props = {
  path: string
  field: SelectField
}

const DividerStyleField = ({ path, field }: Props) => {
  const { value, setValue } = useField<string>({ path })

  const fieldLabel = typeof field.label === 'string' ? field.label : 'Stile'
  const fieldDescription =
    field.admin && typeof field.admin.description === 'string' ? field.admin.description : ''

  return (
    <div className="divider-style-field">
      <div className="field-label">
        <label>{fieldLabel}</label>
        {fieldDescription && <p className="field-description">{fieldDescription}</p>}
      </div>

      {/* Select nativo */}
      <select
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          marginBottom: '1rem',
        }}
      >
        <option value="">Seleziona uno stile...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Anteprima dello stile selezionato */}
      {value && shapePaths[value] && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: '#374151',
            }}
          >
            Anteprima: {options.find((opt) => opt.value === value)?.label || value}
          </div>
          <div
            style={{
              width: '100%',
              height: '80px',
              backgroundColor: '#ffffff',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '0.25rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <svg
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '80px',
              }}
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={shapePaths[value]} fill="#3b82f6" />
            </svg>
          </div>
        </div>
      )}

      {/* Griglia con tutte le anteprime */}
      <div
        style={{
          marginTop: '1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setValue(option.value)}
            style={{
              padding: '0.75rem',
              border: `2px solid ${value === option.value ? '#3b82f6' : '#e5e7eb'}`,
              borderRadius: '0.5rem',
              backgroundColor: value === option.value ? '#eff6ff' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              if (value !== option.value) {
                e.currentTarget.style.borderColor = '#9ca3af'
              }
            }}
            onMouseLeave={(e) => {
              if (value !== option.value) {
                e.currentTarget.style.borderColor = '#e5e7eb'
              }
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: value === option.value ? '#1e40af' : '#374151',
              }}
            >
              {option.label}
            </div>
            <div
              style={{
                width: '100%',
                height: '50px',
                backgroundColor: '#f9fafb',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '0.25rem',
              }}
            >
              <svg
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '50px',
                }}
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={shapePaths[option.value]}
                  fill={value === option.value ? '#3b82f6' : '#6b7280'}
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .divider-style-field {
          width: 100%;
        }
        .field-label {
          margin-bottom: 0.5rem;
        }
        .field-label label {
          display: block;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
        .field-description {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
        }
      `}</style>
    </div>
  )
}

export default DividerStyleField
