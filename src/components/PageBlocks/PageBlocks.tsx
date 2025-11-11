import React from 'react'
import type { Page } from '@/payload-types'
import HeroBlock from './HeroBlock'
import CallToActionBlock from './CallToActionBlock'
import RichTextBlock from './RichTextBlock'
import CardGridBlock from './CardGridBlock'
import FileDownloadBlock from './FileDownloadBlock'
import GalleryBlock from './GalleryBlock'
import ArticleListBlock from './ArticleListBlock'
import EventListBlock from './EventListBlock'
import ProjectListBlock from './ProjectListBlock'
import CommunicationsBlock from './CommunicationsBlock'
import TeacherListBlock from './TeacherListBlock'

type Props = {
  blocks: Page['blocks']
  schoolId?: string | number
  schoolSlug?: string
}

export default function PageBlocks({ blocks, schoolId, schoolSlug }: Props) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        // Hero blocks devono essere full-width, senza wrapper
        if (block.blockType === 'hero') {
          return <HeroBlock key={index} block={block} />
        }

        // ArticleList ed EventList blocks sono full-width
        if (block.blockType === 'articleList') {
          if (!schoolId || !schoolSlug) {
            console.warn('ArticleListBlock requires schoolId and schoolSlug')
            return null
          }
          return (
            <ArticleListBlock
              key={index}
              block={block}
              schoolId={schoolId}
              schoolSlug={schoolSlug}
            />
          )
        }

        if (block.blockType === 'eventList') {
          if (!schoolId || !schoolSlug) {
            console.warn('EventListBlock requires schoolId and schoolSlug')
            return null
          }
          return (
            <EventListBlock key={index} block={block} schoolId={schoolId} schoolSlug={schoolSlug} />
          )
        }

        if (block.blockType === 'projectList') {
          if (!schoolId || !schoolSlug) {
            console.warn('ProjectListBlock requires schoolId and schoolSlug')
            return null
          }
          return (
            <ProjectListBlock
              key={index}
              block={block}
              schoolId={schoolId}
              schoolSlug={schoolSlug}
            />
          )
        }

        if (block.blockType === 'communications') {
          if (!schoolId || !schoolSlug) {
            console.warn('CommunicationsBlock requires schoolId and schoolSlug')
            return null
          }
          return (
            <CommunicationsBlock
              key={index}
              block={block}
              schoolId={schoolId}
              schoolSlug={schoolSlug}
            />
          )
        }

        // TeacherList block è full-width
        if (block.blockType === 'teacherList') {
          if (!schoolId || !schoolSlug) {
            console.warn('TeacherListBlock requires schoolId and schoolSlug')
            return null
          }
          return (
            <TeacherListBlock
              key={index}
              block={block}
              schoolId={schoolId}
              schoolSlug={schoolSlug}
            />
          )
        }

        // Gallery block è full-width
        if (block.blockType === 'gallery') {
          return <GalleryBlock key={index} block={block} />
        }

        // Altri blocchi con layout standard
        return (
          <div key={index} className="space-y-8 max-w-5xl mx-auto">
            {(() => {
              switch (block.blockType) {
                case 'callToAction':
                  return <CallToActionBlock block={block} />
                case 'richText':
                  return <RichTextBlock block={block} />
                case 'cardGrid':
                  return <CardGridBlock block={block} />
                case 'fileDownload':
                  return <FileDownloadBlock block={block} />
                default:
                  return null
              }
            })()}
          </div>
        )
      })}
    </>
  )
}
