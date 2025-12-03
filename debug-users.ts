import { getPayload } from 'payload'
import config from '@payload-config'

async function debugUserAccess() {
  const payload = await getPayload({ config })

  try {
    // Ottieni tutti gli utenti
    const users = await payload.find({
      collection: 'users',
      limit: 100,
    })

    console.log('\n=== DEBUG UTENTI ===\n')

    for (const user of users.docs) {
      console.log(`📧 Email: ${user.email}`)
      console.log(`👤 Ruolo: ${user.role}`)
      console.log(`🏫 Scuole assegnate: ${user.schools?.length || 0}`)

      if (user.schools && user.schools.length > 0) {
        for (const school of user.schools) {
          const schoolId = typeof school === 'string' ? school : school.id
          const schoolData = await payload.findByID({
            collection: 'schools',
            id: schoolId,
          })
          console.log(`   - ${schoolData.name} (${schoolData.slug})`)

          if (schoolData.featureVisibility) {
            console.log('   Feature Flags:')
            Object.entries(schoolData.featureVisibility).forEach(([key, value]) => {
              console.log(`      ${key}: ${value ? '✅' : '❌'}`)
            })
          }
        }
      } else {
        console.log('   ⚠️  NESSUNA SCUOLA ASSEGNATA!')
      }

      console.log(`✅ Privacy accettata: ${user.acceptedPrivacyPolicy || false}`)
      console.log(`✅ ToS accettati: ${user.acceptedTermsOfService || false}`)
      console.log('---\n')
    }
  } catch (error) {
    console.error('Errore:', error)
  }

  process.exit(0)
}

debugUserAccess()
