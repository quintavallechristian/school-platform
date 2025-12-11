import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page, Communication } from '@/payload-types'
import { CommunicationsList } from '@/components/CommunicationsList/CommunicationsList'
import { Button } from '@/components/ui/button'
import EmptyArea from '../EmptyArea/EmptyArea'

type CommunicationsBlockType = Extract<
  NonNullable<Page['blocks']>[number],
  { blockType: 'communications' }
>

type Props = {
  block: CommunicationsBlockType
  schoolId: string | number
  baseHref?: string
}

export default async function CommunicationsBlock({ block, schoolId, baseHref }: Props) {
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
        {block.title && <h2 className="text-3xl font-bold mb-8 text-primary">{block.title}</h2>}
        <EmptyArea title="Nessuna comunicazione disponibile" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      {block.title && <h2 className="text-3xl font-bold mb-8 text-primary">{block.title}</h2>}

      <CommunicationsList communications={communications as Communication[]} baseHref={baseHref} />

      {block.showViewAll && (
        <div className="text-center mt-8">
          <Link href={`${baseHref}/comunicazioni`}>
            <Button variant="outline" size="lg">
              Vedi tutte le comunicazioni →
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
