/**
 * Libreria di utilità per l'accessibilità
 * Implementa funzioni per validare la conformità WCAG 2.1 AA
 */

/**
 * Converte un colore hex in RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Calcola la luminanza relativa di un colore
 * Formula WCAG: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calcola il rapporto di contrasto tra due colori
 * Deve essere almeno 4.5:1 per testo normale (WCAG AA)
 * Deve essere almeno 3:1 per testo grande (WCAG AA)
 * Deve essere almeno 7:1 per testo normale (WCAG AAA)
 *
 * @param color1 Colore in formato hex (#RRGGBB)
 * @param color2 Colore in formato hex (#RRGGBB)
 * @returns Rapporto di contrasto (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) {
    throw new Error('Formato colore non valido. Usa formato hex (#RRGGBB)')
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Verifica se il contrasto rispetta WCAG AA per testo normale
 * @param ratio Rapporto di contrasto
 * @returns true se >= 4.5:1
 */
export function meetsWCAG_AA_Normal(ratio: number): boolean {
  return ratio >= 4.5
}

/**
 * Verifica se il contrasto rispetta WCAG AA per testo grande (18pt+ o 14pt+ bold)
 * @param ratio Rapporto di contrasto
 * @returns true se >= 3:1
 */
export function meetsWCAG_AA_Large(ratio: number): boolean {
  return ratio >= 3
}

/**
 * Verifica se il contrasto rispetta WCAG AAA per testo normale
 * @param ratio Rapporto di contrasto
 * @returns true se >= 7:1
 */
export function meetsWCAG_AAA_Normal(ratio: number): boolean {
  return ratio >= 7
}

/**
 * Verifica se il contrasto rispetta WCAG AAA per testo grande
 * @param ratio Rapporto di contrasto
 * @returns true se >= 4.5:1
 */
export function meetsWCAG_AAA_Large(ratio: number): boolean {
  return ratio >= 4.5
}

export interface SchoolColors {
  primaryColor?: string
  secondaryColor?: string
  backgroundPrimaryColor?: string
  backgroundSecondaryColor?: string
  lightTheme?: {
    textPrimary?: string
    textSecondary?: string
    backgroundPrimary?: string
    backgroundSecondary?: string
  }
  darkTheme?: {
    textPrimary?: string
    textSecondary?: string
    backgroundPrimary?: string
    backgroundSecondary?: string
  }
}

export interface ContrastIssue {
  pair: string
  ratio: number
  meetsAA: boolean
  meetsAAA: boolean
  recommendation: string
}

/**
 * Valida che i colori della scuola rispettino WCAG 2.1 AA
 * Controlla il contrasto tra testo e sfondo
 *
 * @param colors Oggetto con i colori della scuola
 * @param backgroundColor Colore di sfondo di default (es. #FFFFFF per light, #000000 per dark)
 * @returns Oggetto con validità e lista di problemi
 */
export function validateSchoolColors(
  colors: SchoolColors,
  backgroundColor: string = '#FFFFFF',
): {
  valid: boolean
  issues: ContrastIssue[]
  warnings: string[]
} {
  const issues: ContrastIssue[] = []
  const warnings: string[] = []

  // Funzione helper per testare una coppia di colori
  const testColorPair = (
    textColor: string | undefined,
    bgColor: string,
    pairName: string,
  ): void => {
    if (!textColor) {
      warnings.push(`${pairName}: colore testo non definito`)
      return
    }

    try {
      const ratio = getContrastRatio(textColor, bgColor)
      const meetsAA = meetsWCAG_AA_Normal(ratio)
      const meetsAAA = meetsWCAG_AAA_Normal(ratio)

      if (!meetsAA) {
        issues.push({
          pair: pairName,
          ratio: Math.round(ratio * 100) / 100,
          meetsAA,
          meetsAAA,
          recommendation: `Aumentare il contrasto a minimo 4.5:1 (attuale: ${Math.round(ratio * 100) / 100}:1)`,
        })
      }
    } catch (error) {
      warnings.push(`${pairName}: ${error instanceof Error ? error.message : 'errore sconosciuto'}`)
    }
  }

  // Test Light Theme
  if (colors.lightTheme) {
    testColorPair(
      colors.lightTheme.textPrimary || colors.primaryColor,
      colors.lightTheme.backgroundPrimary || backgroundColor,
      'Light Theme - Primary Text/Background',
    )
    testColorPair(
      colors.lightTheme.textSecondary || colors.secondaryColor,
      colors.lightTheme.backgroundSecondary || backgroundColor,
      'Light Theme - Secondary Text/Background',
    )
  } else {
    // Fallback ai colori base
    testColorPair(colors.primaryColor, backgroundColor, 'Primary Color on White')
    testColorPair(colors.secondaryColor, backgroundColor, 'Secondary Color on White')
  }

  // Test Dark Theme
  if (colors.darkTheme) {
    const darkBg = '#000000'
    testColorPair(
      colors.darkTheme.textPrimary,
      colors.darkTheme.backgroundPrimary || darkBg,
      'Dark Theme - Primary Text/Background',
    )
    testColorPair(
      colors.darkTheme.textSecondary,
      colors.darkTheme.backgroundSecondary || darkBg,
      'Dark Theme - Secondary Text/Background',
    )
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
  }
}

/**
 * Suggerisce un colore alternativo che rispetta il contrasto minimo
 * Scurisce o schiarisce il colore fino a raggiungere il rapporto richiesto
 *
 * @param textColor Colore del testo
 * @param backgroundColor Colore dello sfondo
 * @param targetRatio Rapporto di contrasto desiderato (default 4.5 per WCAG AA)
 * @returns Colore suggerito in formato hex
 */
export function suggestAccessibleColor(
  textColor: string,
  backgroundColor: string,
  targetRatio: number = 4.5,
): string {
  const rgb = hexToRgb(textColor)
  if (!rgb) return textColor

  // Prova a scurire
  let adjustedColor = textColor
  let ratio = getContrastRatio(adjustedColor, backgroundColor)

  if (ratio < targetRatio) {
    // Scurisce progressivamente
    for (let i = 0; i < 100; i++) {
      const factor = i / 100
      const newR = Math.max(0, Math.floor(rgb.r * (1 - factor)))
      const newG = Math.max(0, Math.floor(rgb.g * (1 - factor)))
      const newB = Math.max(0, Math.floor(rgb.b * (1 - factor)))

      adjustedColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
      ratio = getContrastRatio(adjustedColor, backgroundColor)

      if (ratio >= targetRatio) {
        return adjustedColor
      }
    }
  }

  return adjustedColor
}

/**
 * Formatta il risultato della validazione per il log
 */
export function formatValidationReport(validation: ReturnType<typeof validateSchoolColors>): string {
  let report = '=== REPORT VALIDAZIONE ACCESSIBILITÀ COLORI ===\n\n'

  if (validation.valid) {
    report += '✅ Tutti i colori rispettano WCAG 2.1 AA\n'
  } else {
    report += '❌ Alcuni colori NON rispettano WCAG 2.1 AA\n\n'
    report += 'PROBLEMI RILEVATI:\n'
    validation.issues.forEach((issue) => {
      report += `\n- ${issue.pair}\n`
      report += `  Contrasto: ${issue.ratio}:1\n`
      report += `  WCAG AA: ${issue.meetsAA ? '✅' : '❌'}\n`
      report += `  WCAG AAA: ${issue.meetsAAA ? '✅' : '❌'}\n`
      report += `  ${issue.recommendation}\n`
    })
  }

  if (validation.warnings.length > 0) {
    report += '\n⚠️  AVVISI:\n'
    validation.warnings.forEach((warning) => {
      report += `- ${warning}\n`
    })
  }

  return report
}
