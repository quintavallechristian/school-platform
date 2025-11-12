import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { School } from '../src/payload-types'

async function checkSchoolAdminUsers() {
  console.log('🔍 Controllo utenti school-admin...\n')

  const payloadInstance = await getPayload({ config })

  try {
    // Trova tutti gli utenti con ruolo school-admin
    const result = await payloadInstance.find({
      collection: 'users',
      where: {
        role: {
          equals: 'school-admin',
        },
      },
      depth: 2, // Per popolare le relazioni schools
    })

    console.log(`\n📊 Trovati ${result.docs.length} utenti school-admin:\n`)

    result.docs.forEach((user) => {
      console.log('👤 User:', {
        id: user.id,
        email: user.email,
        role: user.role,
        schools: user.schools,
        schoolsCount: user.schools?.length || 0,
      })

      if (!user.schools || user.schools.length === 0) {
        console.log('  ⚠️  PROBLEMA: Questo utente NON ha scuole assegnate!')
      } else {
        console.log('  ✅ Scuole assegnate correttamente')
        user.schools.forEach((school) => {
          console.log(
            `     - ${typeof school === 'object' ? (school as Record<string, unknown>).name : school}`,
          )
        })
      }
      console.log('')
    })

    // Controlla anche se ci sono articoli/eventi/ecc
    console.log('\n📝 Controllo contenuti...\n')

    const articles = await payloadInstance.find({
      collection: 'articles',
      limit: 1,
    })
    console.log(`Articoli nel database: ${articles.totalDocs}`)

    const events = await payloadInstance.find({
      collection: 'events',
      limit: 1,
    })
    console.log(`Eventi nel database: ${events.totalDocs}`)

    const communications = await payloadInstance.find({
      collection: 'communications',
      limit: 1,
    })
    console.log(`Comunicazioni nel database: ${communications.totalDocs}`)

    const galleries = await payloadInstance.find({
      collection: 'gallery',
      limit: 1,
    })
    console.log(`Gallerie nel database: ${galleries.totalDocs}`)

    // Mostra a quali scuole appartengono questi contenuti
    if (articles.totalDocs > 0) {
      console.log('\n🏫 Scuole associate agli articoli:')
      const allArticles = await payloadInstance.find({
        collection: 'articles',
        limit: 100,
      })
      const schoolIds = new Set(
        allArticles.docs
          .filter((a) => a.school)
          .map((a) => (typeof a.school === 'object' ? a.school!.id : a.school)),
      )
      console.log('  School IDs:', Array.from(schoolIds))
    }
  } catch (error) {
    console.error('❌ Errore:', error)
  }

  process.exit(0)
}

checkSchoolAdminUsers()
