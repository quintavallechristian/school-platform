import { getPayload } from 'payload'
import config from '@payload-config'
import Hero from '@/components/Hero/Hero'
import { CommunicationsList } from '@/components/CommunicationsList/CommunicationsList'

export default async function ComunicazioniPage() {
  const payload = await getPayload({ config })

  const now = new Date()

  const { docs: communications } = await payload.find({
    collection: 'communications',
    where: {
      and: [
        {
          isActive: {
            equals: true,
          },
        },
        {
          or: [
            {
              expiresAt: {
                exists: false,
              },
            },
            {
              expiresAt: {
                greater_than: now.toISOString(),
              },
            },
          ],
        },
      ],
    },
    sort: '-publishedAt',
    limit: 100,
  })

  return (
    <>
      <Hero title="Comunicazioni di Servizio" subtitle="Avvisi e informazioni importanti" />

      <div className="container mx-auto px-4 py-12">
        {communications.length > 0 ? (
          <CommunicationsList communications={communications} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nessuna comunicazione al momento.</p>
          </div>
        )}
      </div>
    </>
  )
}
