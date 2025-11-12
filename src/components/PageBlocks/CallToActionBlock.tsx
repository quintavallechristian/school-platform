import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Button } from '@/components/ui/button'
import type { Page, Media } from '@/payload-types'

type CallToActionBlock = Extract<NonNullable<Page['blocks']>[number], { blockType: 'callToAction' }>

type Props = {
  block: CallToActionBlock
}

export default function CallToActionBlock({ block }: Props) {
  const image = block.image as Media | undefined

  // Se c'è un'immagine, usa layout con immagine a sinistra
  if (image?.url) {
    return (
      <SpotlightCard className="rounded-xl overflow-hidden max-w-2xl mx-auto my-8 px-4 py-4">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Immagine a sinistra */}
          <div className="relative h-64 md:h-auto">
            <Image
              src={image.url}
              alt={image.alt || block.title || 'Call to Action'}
              fill
              className="object-cover rounded-xl shadow-2xl"
            />
          </div>

          <div className="p-8 md:pl-12 md:py-12 flex flex-col justify-center">
            {block.title && <h3 className="text-2xl font-bold mb-4 text-primary">{block.title}</h3>}
            {block.subtitle && <p className="mb-6 whitespace-pre-line">{block.subtitle}</p>}
            {block.buttons && block.buttons.length > 0 && (
              <div className="flex gap-4 flex-wrap">
                {block.buttons.map((button, index) => (
                  <Link key={index} href={button.href}>
                    <Button
                      variant={
                        (button.variant as 'default' | 'secondary' | 'outline' | 'ghost') ||
                        'default'
                      }
                    >
                      {button.text}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </SpotlightCard>
    )
  }

  // Layout originale senza immagine
  return (
    <SpotlightCard className="rounded-xl p-12 text-center max-w-2xl mx-auto my-8">
      {block.title && <h3 className="text-2xl font-bold mb-4 text-primary">{block.title}</h3>}
      {block.subtitle && <p className="mb-8 whitespace-pre-line">{block.subtitle}</p>}
      {block.buttons && block.buttons.length > 0 && (
        <div className="flex gap-4 justify-center flex-wrap">
          {block.buttons.map((button, index) => (
            <Link key={index} href={button.href}>
              <Button
                variant={
                  (button.variant as 'default' | 'secondary' | 'outline' | 'ghost') || 'default'
                }
              >
                {button.text}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </SpotlightCard>
  )
}
