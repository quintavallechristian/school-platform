import React from 'react'
import Link from 'next/link'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import type { Page, Media } from '@/payload-types'
import Image from 'next/image'

type CardGridBlock = Extract<NonNullable<Page['blocks']>[number], { blockType: 'cardGrid' }>

type Props = {
  block: CardGridBlock
}

export default function CardGridBlock({ block }: Props) {
  const columnsClass = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-2 lg:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }[block.columns || '3']

  return (
    <div className="my-12">
      {block.title && <h2 className="text-3xl font-bold mb-8 text-center">{block.title}</h2>}
      <div className={`grid grid-cols-1 ${columnsClass} gap-6`}>
        {block.cards?.map((card, index) => {
          const imageUrl =
            card.image && typeof card.image === 'object' ? (card.image as Media).url : null

          const CardContent = (
            <SpotlightCard key={index} className="p-6 h-full flex flex-col">
              {imageUrl && (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              {card.description && (
                <p className="text-muted-foreground grow whitespace-pre-line">{card.description}</p>
              )}
            </SpotlightCard>
          )

          if (card.link) {
            return (
              <Link key={index} href={card.link} className="block h-full">
                {CardContent}
              </Link>
            )
          }

          return CardContent
        })}
      </div>
    </div>
  )
}
