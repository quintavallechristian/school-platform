'use client'

import { useField } from '@payloadcms/ui'
import React from 'react'
import type { TextFieldClientComponent } from 'payload'
import { Label } from '../ui/label'

const ColorPickerField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path: path || field.name })

  const handleChange = (newValue: string) => {
    setValue(newValue)
  }

  const labelText = typeof field.label === 'string' ? field.label : field.name
  const descriptionText =
    field.admin?.description && typeof field.admin.description === 'string'
      ? field.admin.description
      : ''

  return (
    <div className="field-type">
      <Label className="field-label" htmlFor={field.name}>
        {labelText}
        {field.required && <span className="required">*</span>}
      </Label>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="color"
          id={field.name}
          value={value || '#000000'}
          onChange={(e) => handleChange(e.target.value)}
          style={{
            width: '60px',
            height: '40px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Trasparente"
          pattern="^#[0-9A-Fa-f]{6}$"
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '14px',
            backgroundColor: 'var(--theme-elevation-50)',
            color: 'var(--theme-elevation-800)',
          }}
        />
      </div>
      {descriptionText && (
        <div className="field-description" style={{ marginTop: '4px', fontSize: '13px' }}>
          {descriptionText}
        </div>
      )}
    </div>
  )
}

export default ColorPickerField
