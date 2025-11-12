import React from 'react'
import type { Page } from '@/payload-types'
import { RichTextRenderer } from '../RichTextRenderer/RichTextRenderer'

type RichTextBlock = Extract<NonNullable<Page['blocks']>[number], { blockType: 'richText' }>

type Props = {
  block: RichTextBlock
}

export default function RichTextBlock({ block }: Props) {
  return <div>{block.content && <RichTextRenderer content={block.content} />}</div>
}
