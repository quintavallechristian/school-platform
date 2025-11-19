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
import TestimonialsBlock from './TestimonialsBlock'

type Props = {
  blocks: Page['blocks']
  schoolId?: string | number
  schoolSlug?: string
}

// Helper function per mappare i colori di sfondo alle classi CSS
const getBackgroundStyle = (
  backgroundColor?: string | null,
): { className: string; style?: React.CSSProperties } => {
  if (!backgroundColor || backgroundColor.trim() === '') {
    return { className: '' }
  }

  // Se è un colore esadecimale, usa lo style inline
  if (backgroundColor.startsWith('#')) {
    return {
      className: 'py-4 w-full',
      style: {
        backgroundColor,
        minHeight: '100px',
      },
    }
  }

  // Fallback per eventuali valori legacy
  return { className: '' }
}

export default function PageBlocks({ blocks, schoolId, schoolSlug }: Props) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bgStyle = getBackgroundStyle((block as any).backgroundColor)

        // Wrapper esterno per il background full-width
        const wrapperClass = bgStyle.className || 'py-16'

        // Hero blocks - il contenuto è già full-width internamente
        if (block.blockType === 'hero') {
          return (
            <div key={index} className={wrapperClass} style={bgStyle.style}>
              <HeroBlock block={block} />
            </div>
          )
        }

        // ArticleList - wrapper interno max-w-5xl
        if (block.blockType === 'articleList') {
          if (!schoolId || !schoolSlug) {
            console.warn('ArticleListBlock requires schoolId and schoolSlug')
            return null
          }
          return (
            <div key={index} className={wrapperClass} style={bgStyle.style}>
              <div className="max-w-5xl mx-auto px-4">
                <ArticleListBlock block={block} schoolId={schoolId} schoolSlug={schoolSlug} />
              </div>
            </div>
          )
        }

        // EventList - wrapper interno max-w-5xl
        if (block.blockType === 'eventList') {
          if (!schoolId || !schoolSlug) {
            console.warn('EventListBlock requires schoolId and schoolSlug')
            return null
          }
          return (
            <div key={index} className={wrapperClass} style={bgStyle.style}>
              <div className="max-w-5xl mx-auto px-4">
                <EventListBlock block={block} schoolId={schoolId} schoolSlug={schoolSlug} />
              </div>
            </div>
          )
        }

        // ProjectList - wrapper interno max-w-5xl
        if (block.blockType === 'projectList') {
          if (!schoolId || !schoolSlug) {
            console.warn('ProjectListBlock requires schoolId and schoolSlug')
            return null
          }
          return (
            <div key={index} className={wrapperClass} style={bgStyle.style}>
              <div className="max-w-5xl mx-auto px-4">
                <ProjectListBlock block={block} schoolId={schoolId} schoolSlug={schoolSlug} />
              </div>
            </div>
          )
        }

        // Communications - wrapper interno max-w-5xl
        if (block.blockType === 'communications') {
          if (!schoolId || !schoolSlug) {
            console.warn('CommunicationsBlock requires schoolId and schoolSlug')
            return null
          }
          return (
            <div key={index} className={wrapperClass} style={bgStyle.style}>
              <div className="max-w-5xl mx-auto px-4">
                <CommunicationsBlock block={block} schoolId={schoolId} schoolSlug={schoolSlug} />
              </div>
            </div>
          )
        }

        // TeacherList - wrapper interno max-w-5xl
        if (block.blockType === 'teacherList') {
          if (!schoolId || !schoolSlug) {
            console.warn('TeacherListBlock requires schoolId and schoolSlug')
            return null
          }
          return (
            <div key={index} className={wrapperClass} style={bgStyle.style}>
              <div className="max-w-5xl mx-auto px-4">
                <TeacherListBlock block={block} schoolId={schoolId} schoolSlug={schoolSlug} />
              </div>
            </div>
          )
        }

        // Gallery - wrapper interno max-w-5xl
        if (block.blockType === 'gallery') {
          return (
            <div key={index} className={wrapperClass} style={bgStyle.style}>
              <div className="max-w-5xl mx-auto px-4">
                <GalleryBlock block={block} />
              </div>
            </div>
          )
        }

        if (block.blockType === 'testimonials') {
          if (!schoolId || !schoolSlug) {
            console.warn('TestimonialsBlock requires schoolId')
            return null
          }
          return (
            <div key={index} className={wrapperClass} style={bgStyle.style}>
              <div className="max-w-5xl mx-auto px-4">
                <TestimonialsBlock block={block} schoolId={schoolId} schoolSlug={schoolSlug} />
              </div>
            </div>
          )
        }

        // Altri blocchi con layout standard
        return (
          <div key={index} className={wrapperClass} style={bgStyle.style}>
            <div className="max-w-5xl mx-auto px-4">
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
          </div>
        )
      })}
    </>
  )
}
