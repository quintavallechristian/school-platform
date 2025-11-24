    /**
 * Script di test accessibilità
 * Valida i colori delle scuole nel database
 * 
 * Uso: npm run test:accessibility
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

// Importa le funzioni di validazione
// Nota: in un ambiente Node.js potrebbe essere necessario usare require invece di import
async function testSchoolColors() {
  console.log('🔍 Avvio test accessibilità colori scuole...\n')

  try {
    const payload = await getPayload({ config })

    // Recupera tutte le scuole
    const { docs: schools } = await payload.find({
      collection: 'schools',
      limit: 1000,
    })

    console.log(`📊 Trovate ${schools.length} scuole da testare\n`)

    let totalIssues = 0
    const schoolsWithIssues = []

    for (const school of schools) {
      console.log(`\n${'='.repeat(60)}`)
      console.log(`🏫 Scuola: ${school.name}`)
      console.log(`${'='.repeat(60)}`)

      // Valida colori light theme
      if (school.lightTheme || school.primaryColor) {
        console.log('\n📱 Light Theme:')
        const issues = validateColorPair(
          school.lightTheme?.textPrimary || school.primaryColor,
          school.lightTheme?.backgroundPrimary || '#FFFFFF',
          'Primary Text/Background'
        )
        if (issues) {
          totalIssues++
          schoolsWithIssues.push({ name: school.name, theme: 'light', ...issues })
        }
      }

      // Valida colori dark theme
      if (school.darkTheme) {
        console.log('\n🌙 Dark Theme:')
        const issues = validateColorPair(
          school.darkTheme?.textPrimary,
          school.darkTheme?.backgroundPrimary || '#000000',
          'Primary Text/Background'
        )
        if (issues) {
          totalIssues++
          schoolsWithIssues.push({ name: school.name, theme: 'dark', ...issues })
        }
      }
    }

    // Report finale
    console.log('\n\n' + '='.repeat(60))
    console.log('📋 REPORT FINALE')
    console.log('='.repeat(60))

    if (totalIssues === 0) {
      console.log('\n✅ Tutte le scuole rispettano WCAG 2.1 AA!')
    } else {
      console.log(`\n❌ Trovati ${totalIssues} problemi di contrasto\n`)
      console.log('Scuole con problemi:')
      schoolsWithIssues.forEach(issue => {
        console.log(`\n- ${issue.name} (${issue.theme} theme)`)
        console.log(`  Contrasto: ${issue.ratio}:1 (minimo richiesto: 4.5:1)`)
        console.log(`  ${issue.recommendation}`)
      })
    }

    process.exit(totalIssues > 0 ? 1 : 0)

  } catch (error) {
    console.error('❌ Errore durante il test:', error)
    process.exit(1)
  }
}

/**
 * Funzioni helper per validazione colori
 * (Versione semplificata - per produzione usare src/lib/accessibility.ts)
 */
function hexToRgb(hex) {
  if (!hex) return null
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return null

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

function validateColorPair(textColor, bgColor, pairName) {
  if (!textColor || !bgColor) {
    console.log(`  ⚠️  ${pairName}: colori non definiti`)
    return null
  }

  const ratio = getContrastRatio(textColor, bgColor)
  
  if (!ratio) {
    console.log(`  ⚠️  ${pairName}: formato colore non valido`)
    return null
  }

  const meetsAA = ratio >= 4.5
  const meetsAAA = ratio >= 7

  console.log(`  ${pairName}:`)
  console.log(`    Testo: ${textColor}`)
  console.log(`    Sfondo: ${bgColor}`)
  console.log(`    Contrasto: ${ratio.toFixed(2)}:1`)
  console.log(`    WCAG AA: ${meetsAA ? '✅' : '❌'}`)
  console.log(`    WCAG AAA: ${meetsAAA ? '✅' : '❌'}`)

  if (!meetsAA) {
    return {
      ratio: ratio.toFixed(2),
      recommendation: `Aumentare il contrasto a minimo 4.5:1`
    }
  }

  return null
}

// Esegui il test
testSchoolColors()
