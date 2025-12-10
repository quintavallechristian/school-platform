'use client'

import React, { useEffect, useState } from 'react'
import { useFormFields } from '@payloadcms/ui'
import { getContrastRatio } from '@/lib/accessibility'

interface ContrastWarningProps {
  textPrimaryPath: string
  textSecondaryPath: string
  backgroundPrimaryPath: string
  backgroundSecondaryPath: string
  themeName: string
}

interface ContrastResult {
  pair: string
  ratio: number
  meetsAA: boolean
  textColor: string
  bgColor: string
}

export const ContrastWarning: React.FC<ContrastWarningProps> = ({
  textPrimaryPath,
  textSecondaryPath,
  backgroundPrimaryPath,
  backgroundSecondaryPath,
  themeName,
}) => {
  const [results, setResults] = useState<ContrastResult[]>([])

  // Usa useFormFields per ottenere i valori dei campi
  const textPrimary = useFormFields(([fields]) => fields[textPrimaryPath]?.value as string)
  const textSecondary = useFormFields(([fields]) => fields[textSecondaryPath]?.value as string)
  const bgPrimary = useFormFields(([fields]) => fields[backgroundPrimaryPath]?.value as string)
  const bgSecondary = useFormFields(([fields]) => fields[backgroundSecondaryPath]?.value as string)

  useEffect(() => {
    // Funzione per validare una coppia di colori
    const validateColorPair = (
      textColor: string | undefined,
      bgColor: string | undefined,
      pairName: string,
    ): ContrastResult | null => {
      if (!textColor || !bgColor) {
        return null
      }

      try {
        const ratio = getContrastRatio(textColor, bgColor)
        const meetsAA = ratio >= 4.5

        return {
          pair: pairName,
          ratio: Math.round(ratio * 100) / 100,
          meetsAA,
          textColor,
          bgColor,
        }
      } catch (error) {
        console.error(`Errore nel calcolo del contrasto per ${pairName}:`, error)
        return null
      }
    }

    const newResults: ContrastResult[] = []

    // Valida TUTTE le combinazioni di testo e sfondo
    // perché in pratica qualsiasi testo può apparire su qualsiasi sfondo

    // Testo Primario su Sfondo Primario
    const result1 = validateColorPair(textPrimary, bgPrimary, 'Testo Primario su Sfondo Primario')
    if (result1) newResults.push(result1)

    // Testo Primario su Sfondo Secondario
    const result2 = validateColorPair(
      textPrimary,
      bgSecondary,
      'Testo Primario su Sfondo Secondario',
    )
    if (result2) newResults.push(result2)

    // Testo Secondario su Sfondo Primario
    const result3 = validateColorPair(
      textSecondary,
      bgPrimary,
      'Testo Secondario su Sfondo Primario',
    )
    if (result3) newResults.push(result3)

    // Testo Secondario su Sfondo Secondario
    const result4 = validateColorPair(
      textSecondary,
      bgSecondary,
      'Testo Secondario su Sfondo Secondario',
    )
    if (result4) newResults.push(result4)

    setResults(newResults)
  }, [textPrimary, textSecondary, bgPrimary, bgSecondary])

  // Filtra solo i risultati che non rispettano WCAG AA
  const warnings = results.filter((result) => !result.meetsAA)

  if (results.length === 0) {
    return null
  }

  if (warnings.length === 0) {
    return
  }

  return (
    <div
      style={{
        padding: '16px',
        marginTop: '16px',
        marginBottom: '16px',
        backgroundColor: '#fef3c7',
        border: '2px solid #f59e0b',
        borderRadius: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '24px', flexShrink: 0 }}>⚠️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '8px' }}>
            Avviso Contrasto - {themeName}
          </div>
          <div style={{ fontSize: '14px', color: '#78350f', marginBottom: '12px' }}>
            La combinazione di colori scelta può rendere il testo difficile da leggere per persone
            con disabilità visive.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {warnings.map((warning, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #fbbf24',
                  borderRadius: '6px',
                }}
              >
                <div style={{ fontWeight: '600', color: '#92400e', marginBottom: '6px' }}>
                  {warning.pair}
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: warning.textColor,
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                      }}
                      title={`Testo: ${warning.textColor}`}
                    />
                  </div>
                  <span style={{ color: '#9ca3af', fontSize: '12px' }}>su</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: warning.bgColor,
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                      }}
                      title={`Sfondo: ${warning.bgColor}`}
                    />
                  </div>
                </div>
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '13px',
                    color: '#b45309',
                    fontWeight: '500',
                  }}
                >
                  Contrasto attuale: {warning.ratio}:1 (minimo richiesto: 4.5:1)
                </div>
                <div
                  style={{
                    marginTop: '4px',
                    fontSize: '12px',
                    color: '#78350f',
                  }}
                ></div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              backgroundColor: '#fef3c7',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#78350f',
            }}
          >
            💡 <strong>Suggerimento:</strong> Aumenta la differenza di luminosità tra il colore del
            testo e quello dello sfondo per migliorare la leggibilità.
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContrastWarning
