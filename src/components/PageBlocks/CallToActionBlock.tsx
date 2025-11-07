import React from 'react'
import Link from 'next/link'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Button } from '@/components/ui/button'
import type { Page } from '@/payload-types'

type CallToActionBlock = Extract<NonNullable<Page['blocks']>[number], { blockType: 'callToAction' }>

type Props = {
  block: CallToActionBlock
}

export default function CallToActionBlock({ block }: Props) {
  return (
    <SpotlightCard className="rounded-xl p-12 text-center max-w-2xl mx-auto my-8">
      {block.title && <h3 className="text-2xl font-bold mb-4">{block.title}</h3>}
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
