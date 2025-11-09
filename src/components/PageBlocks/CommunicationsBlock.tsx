import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page, Communication } from '@/payload-types'
import { CommunicationsList } from '@/components/CommunicationsList/CommunicationsList'
import { Button } from '@/components/ui/button'

type CommunicationsBlockType = Extract<
  NonNullable<Page['blocks']>[number],
  { blockType: 'communications' }
>

type Props = {
  block: CommunicationsBlockType
  schoolId: string | number
  schoolSlug: string
}

export default async function CommunicationsBlock({ block, schoolId, schoolSlug }: Props) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const now = new Date().toISOString()

  // Determina le priorità da filtrare
  let priorities: ('low' | 'normal' | 'high' | 'urgent')[] = ['low', 'normal', 'high', 'urgent']

  if (block.priorityFilter && block.priorityFilter.length > 0) {
    priorities = block.priorityFilter as ('low' | 'normal' | 'high' | 'urgent')[]
  }

  // Recupera le comunicazioni della scuola
  const { docs: communications } = await payload.find({
    collection: 'communications',
    where: {
      and: [
        { school: { equals: schoolId } },
        { isActive: { equals: true } },
        { priority: { in: priorities } },
        { publishedAt: { less_than_equal: now } },
        {
          or: [{ expiresAt: { greater_than: now } }, { expiresAt: { exists: false } }],
        },
      ],
    },
    limit: block.limit || 10,
    sort: '-publishedAt',
  })

  if (communications.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-16">
        {block.title && <h2 className="text-3xl font-bold mb-8">{block.title}</h2>}
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-xl">📭 Nessuna comunicazione disponibile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      {block.title && <h2 className="text-3xl font-bold mb-8">{block.title}</h2>}

      <CommunicationsList
        communications={communications as Communication[]}
        schoolSlug={schoolSlug}
      />

      {block.showViewAll && (
        <div className="text-center mt-8">
          <Link href={`/${schoolSlug}/comunicazioni`}>
            <Button variant="outline" size="lg">
              Vedi tutte le comunicazioni →
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
