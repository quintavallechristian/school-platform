import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { School } from '../src/payload-types'

async function testSchoolAdminAccess() {
  console.log('🔍 Test accesso school-admin alle collezioni...\n')

  const payload = await getPayload({ config })

  try {
    // Trova l'utente school-admin
    const users = await payload.find({
      collection: 'users',
      where: {
        role: {
          equals: 'school-admin',
        },
      },
      depth: 2,
    })

    if (users.docs.length === 0) {
      console.log('❌ Nessun utente school-admin trovato!')
      process.exit(1)
    }

    const schoolAdmin = users.docs[0]
    console.log('👤 Utente school-admin trovato:')
    console.log(`   Email: ${schoolAdmin.email}`)
    console.log(`   ID: ${schoolAdmin.id}`)
    console.log(
      `   Scuole: ${schoolAdmin.schools?.map((s) => (typeof s === 'object' ? (s as School).name : s)).join(', ')}\n`,
    )

    if (!schoolAdmin.schools || schoolAdmin.schools.length === 0) {
      console.log('❌ School-admin NON ha scuole assegnate!')
      process.exit(1)
    }

    // Estrai gli ID delle scuole
    const schoolIds = schoolAdmin.schools.map((s) => (typeof s === 'object' ? (s as School).id : s))
    console.log('🏫 School IDs:', schoolIds, '\n')

    // Test accesso agli articoli
    console.log('📝 Test accesso agli articoli...')
    const articles = await payload.find({
      collection: 'articles',
      where: {
        school: {
          in: schoolIds,
        },
      },
    })
    console.log(`   ✅ ${articles.totalDocs} articoli trovati per questo school-admin\n`)

    // Test accesso agli eventi
    console.log('📅 Test accesso agli eventi...')
    const events = await payload.find({
      collection: 'events',
      where: {
        school: {
          in: schoolIds,
        },
      },
    })
    console.log(`   ✅ ${events.totalDocs} eventi trovati per questo school-admin\n`)

    // Test accesso alle comunicazioni
    console.log('💬 Test accesso alle comunicazioni...')
    const communications = await payload.find({
      collection: 'communications',
      where: {
        school: {
          in: schoolIds,
        },
      },
    })
    console.log(`   ✅ ${communications.totalDocs} comunicazioni trovate per questo school-admin\n`)

    // Test accesso alle gallerie
    console.log('🖼️  Test accesso alle gallerie...')
    const galleries = await payload.find({
      collection: 'gallery',
      where: {
        school: {
          in: schoolIds,
        },
      },
    })
    console.log(`   ✅ ${galleries.totalDocs} gallerie trovate per questo school-admin\n`)

    // Controlla se ci sono contenuti di altre scuole
    console.log('🔍 Verifica contenuti di altre scuole...')
    const allArticles = await payload.find({
      collection: 'articles',
      limit: 1000,
    })

    const articlesOfOtherSchools = allArticles.docs.filter((a) => {
      const articleSchoolId = typeof a.school === 'object' ? (a.school as School).id : a.school
      return articleSchoolId !== undefined && !schoolIds.includes(articleSchoolId)
    })

    console.log(`   Totale articoli nel sistema: ${allArticles.totalDocs}`)
    console.log(`   Articoli di altre scuole: ${articlesOfOtherSchools.length}`)

    if (articlesOfOtherSchools.length > 0) {
      console.log(
        '   ℹ️  Lo school-admin NON dovrebbe vedere questi articoli (appartenenti ad altre scuole)\n',
      )
    }

    console.log('✅ Test completati con successo!')
    console.log(
      '\n💡 Suggerimento: Prova ora a loggarti come school-admin e verifica di vedere solo i contenuti delle tue scuole',
    )
  } catch (error) {
    console.error('❌ Errore durante il test:', error)
  }

  process.exit(0)
}

testSchoolAdminAccess()
