import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Page } from '@/payload-types'
import SpotlightCard from '../SpotlightCard/SpotlightCard'

type RichTextBlock = Extract<NonNullable<Page['blocks']>[number], { blockType: 'richText' }>

type Props = {
  block: RichTextBlock
}

export default function RichTextBlock({ block }: Props) {
  return (
    <SpotlightCard className="my-8">
      {block.content && (
        <article
          className="prose prose-lg dark:prose-invert max-w-none
            [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-12
            [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-10
            [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:mt-8
            [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mb-2 [&_h4]:mt-6
            [&_p]:mb-4 [&_p]:leading-relaxed
            [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6
            [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6
            [&_li]:mb-2
            [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:my-8 [&_blockquote]:italic
            [&_code]:bg-muted [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
            [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6
            [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-8
            [&_hr]:border-0 [&_hr]:border-t-2 [&_hr]:border-border [&_hr]:my-12
            [&_strong]:font-bold
            [&_em]:italic"
        >
          <RichText data={block.content} />
        </article>
      )}
    </SpotlightCard>
  )
}
