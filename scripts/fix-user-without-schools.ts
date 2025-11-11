/**
 * Script di fix: Assegna una scuola agli utenti che non ne hanno
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

async function fixUsersWithoutSchools() {
  console.log('🔧 Fix utenti senza scuole...')

  const payload = await getPayload({ config })

  try {
    // Trova la prima scuola disponibile
    const schools = await payload.find({
      collection: 'schools',
      limit: 1,
    })

    if (schools.docs.length === 0) {
      console.error('❌ Nessuna scuola trovata nel database!')
      process.exit(1)
    }

    const defaultSchool = schools.docs[0]
    console.log(`📍 Scuola di default: ${defaultSchool.name} (${defaultSchool.id})`)

    // Trova utenti senza scuole
    const users = await payload.find({
      collection: 'users',
      where: {
        or: [{ schools: { exists: false } }, { schools: { equals: [] } }],
      },
    })

    console.log(`👥 Trovati ${users.docs.length} utenti senza scuole`)

    for (const user of users.docs) {
      try {
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            schools: [defaultSchool.id],
          },
        })
        console.log(`✅ Assegnata scuola "${defaultSchool.name}" a ${user.email}`)
      } catch (error) {
        console.error(`❌ Errore per ${user.email}:`, error)
      }
    }

    console.log('\n✨ Fix completato!')
  } catch (error) {
    console.error('❌ Errore:', error)
    process.exit(1)
  }

  process.exit(0)
}

fixUsersWithoutSchools()
