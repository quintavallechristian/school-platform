import React from 'react'
import type { Page } from '@/payload-types'
import CallToActionBlock from './CallToActionBlock'
import RichTextBlock from './RichTextBlock'
import CardGridBlock from './CardGridBlock'
import FileDownloadBlock from './FileDownloadBlock'

type Props = {
  blocks: Page['blocks']
}

export default function PageBlocks({ blocks }: Props) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'callToAction':
            return <CallToActionBlock key={index} block={block} />
          case 'richText':
            return <RichTextBlock key={index} block={block} />
          case 'cardGrid':
            return <CardGridBlock key={index} block={block} />
          case 'fileDownload':
            return <FileDownloadBlock key={index} block={block} />
          default:
            return null
        }
      })}
    </div>
  )
}
