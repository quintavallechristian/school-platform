import React from 'react'
import Hero from '@/components/Hero/Hero'
import type { Page } from '@/payload-types'

type HeroBlockType = Extract<NonNullable<Page['blocks']>[number], { blockType: 'hero' }>

type Props = {
  block: HeroBlockType
}

export default function HeroBlock({ block }: Props) {
  // Prepara i pulsanti nel formato atteso dal componente Hero
  const buttons = block.buttons?.map((button) => ({
    text: button.text,
    href: button.href,
    variant: button.variant as 'default' | 'destructive' | 'outline' | 'link' | undefined,
  }))

  return (
    <Hero
      title={block.title}
      subtitle={block.subtitle || undefined}
      buttons={buttons}
      big={block.fullHeight || false}
    />
  )
}
