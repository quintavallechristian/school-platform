import React from 'react'
import Hero from '@/components/Hero/Hero'
import type { Page } from '@/payload-types'
import type { ShapeDividerStyle } from '@/components/ShapeDivider/ShapeDivider'

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

  // Prepara il divisore superiore
  const topDivider =
    block.topDivider?.enabled && block.topDivider.style
      ? {
          style: block.topDivider.style as ShapeDividerStyle,
          height: block.topDivider.height || undefined,
          flip: block.topDivider.flip || undefined,
          invert: block.topDivider.invert || undefined,
        }
      : undefined

  // Prepara il divisore inferiore
  const bottomDivider =
    block.bottomDivider?.enabled && block.bottomDivider.style
      ? {
          style: block.bottomDivider.style as ShapeDividerStyle,
          height: block.bottomDivider.height || undefined,
          flip: block.bottomDivider.flip || undefined,
          invert: block.bottomDivider.invert || undefined,
        }
      : undefined

  return (
    <Hero
      title={block.title}
      subtitle={block.subtitle || undefined}
      buttons={buttons}
      big={block.fullHeight || false}
      backgroundImage={block.backgroundImage || undefined}
      parallax={block.parallax || false}
      gradientOverlay={block.gradientOverlay || false}
      topDivider={topDivider}
      bottomDivider={bottomDivider}
    />
  )
}
