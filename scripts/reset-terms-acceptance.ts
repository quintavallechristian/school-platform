import { getPayload } from 'payload'
import config from '@payload-config'

async function resetTermsAcceptance(userEmail: string) {
  const payload = await getPayload({ config })

  try {
    // Trova l'utente per email
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: userEmail,
        },
      },
      limit: 1,
    })

    if (users.docs.length === 0) {
      console.error(`❌ Utente con email ${userEmail} non trovato`)
      process.exit(1)
    }

    const user = users.docs[0]

    console.log(`📋 Utente trovato: ${user.email}`)
    console.log(`   Privacy Policy accettata: ${user.acceptedPrivacyPolicy || 'non impostato'}`)
    console.log(`   ToS accettati: ${user.acceptedTermsOfService || 'non impostato'}`)
    console.log(`   Data accettazione: ${user.acceptanceDate || 'non impostato'}`)

    // Resetta i campi di accettazione
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        acceptedPrivacyPolicy: false,
        acceptedTermsOfService: false,
        acceptanceDate: null,
      },
    })

    console.log('\n✅ Campi di accettazione resettati con successo!')
    console.log("   Al prossimo login, l'utente vedrà il banner di accettazione.")

    process.exit(0)
  } catch (error) {
    console.error('❌ Errore durante il reset:', error)
    process.exit(1)
  }
}

// Ottieni l'email dall'argomento della riga di comando
const email = process.argv[2]

if (!email) {
  console.error("❌ Devi fornire un'email come argomento")
  console.log('\nUso: tsx scripts/reset-terms-acceptance.ts <email>')
  console.log('Esempio: tsx scripts/reset-terms-acceptance.ts admin@example.com')
  process.exit(1)
}

resetTermsAcceptance(email)
