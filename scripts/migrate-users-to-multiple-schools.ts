/**
 * Script di migrazione: Converte il campo `school` degli utenti da singolo a array `schools`
 *
 * Esegui questo script dopo aver aggiornato il modello User per supportare più scuole.
 *
 * Uso:
 *   npm run migrate:schools
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

async function migrateUsersToMultipleSchools() {
  console.log('🚀 Inizio migrazione utenti a scuole multiple...')

  const payload = await getPayload({ config })

  try {
    // Ottieni tutti gli utenti
    const users = await payload.find({
      collection: 'users',
      limit: 1000, // Aumenta se hai più di 1000 utenti
      depth: 0,
    })

    console.log(`📊 Trovati ${users.docs.length} utenti da migrare`)

    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const user of users.docs) {
      try {
        // @ts-ignore - Il campo school potrebbe ancora esistere nel database
        const oldSchool = user.school
        const newSchools = user.schools

        // Se l'utente ha già il campo schools popolato, salta
        if (newSchools && Array.isArray(newSchools) && newSchools.length > 0) {
          console.log(`⏭️  Utente ${user.email} già migrato, skip`)
          skippedCount++
          continue
        }

        // Se l'utente aveva il vecchio campo school, convertilo in array
        if (oldSchool) {
          const schoolId = typeof oldSchool === 'string' ? oldSchool : oldSchool.id

          await payload.update({
            collection: 'users',
            id: user.id,
            data: {
              schools: [schoolId],
            },
          })

          console.log(`✅ Migrato utente ${user.email}: school → schools[${schoolId}]`)
          migratedCount++
        } else {
          console.log(`⚠️  Utente ${user.email} non ha scuole assegnate`)
          skippedCount++
        }
      } catch (error) {
        console.error(`❌ Errore durante la migrazione di ${user.email}:`, error)
        errorCount++
      }
    }

    console.log('\n📈 Riepilogo migrazione:')
    console.log(`   ✅ Migrati: ${migratedCount}`)
    console.log(`   ⏭️  Saltati: ${skippedCount}`)
    console.log(`   ❌ Errori: ${errorCount}`)
    console.log('\n✨ Migrazione completata!')
  } catch (error) {
    console.error('❌ Errore durante la migrazione:', error)
    process.exit(1)
  }

  process.exit(0)
}

// Esegui la migrazione
migrateUsersToMultipleSchools()
