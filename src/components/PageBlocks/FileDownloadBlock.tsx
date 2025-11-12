import React from 'react'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import type { Page, Media } from '@/payload-types'
import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FileDownloadBlock = Extract<NonNullable<Page['blocks']>[number], { blockType: 'fileDownload' }>

type Props = {
  block: FileDownloadBlock
}

// Funzione helper per ottenere l'icona in base al tipo di file
const getFileIcon = (mimeType?: string | null) => {
  if (!mimeType) return <FileText className="w-6 h-6" />

  if (mimeType.includes('pdf'))
    return <FileText className="w-6 h-6 text-[hsl(var(--destructive))]" />
  if (mimeType.includes('word') || mimeType.includes('document'))
    return <FileText className="w-6 h-6 text-[hsl(var(--chart-1))]" />
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet'))
    return <FileText className="w-6 h-6 text-[hsl(var(--chart-2))]" />
  if (mimeType.includes('zip') || mimeType.includes('compressed'))
    return <FileText className="w-6 h-6 text-[hsl(var(--chart-5))]" />

  return <FileText className="w-6 h-6" />
}

// Funzione helper per formattare la dimensione del file
const formatFileSize = (bytes?: number | null) => {
  if (!bytes) return ''

  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileDownloadBlock({ block }: Props) {
  return (
    <div className="my-12">
      {block.title && <h2 className="text-3xl font-bold mb-4 text-primary">{block.title}</h2>}
      {block.description && <p className="text-muted-foreground mb-6">{block.description}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {block.files?.map((fileItem, index) => {
          const file = typeof fileItem.file === 'object' ? (fileItem.file as Media) : null

          if (!file) return null

          const fileName = fileItem.title || file.filename || 'File'
          const fileSize = formatFileSize(file.filesize)
          const mimeType = file.mimeType

          return (
            <SpotlightCard key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-1">{getFileIcon(mimeType)}</div>

                <div className="grow min-w-0">
                  <h3 className="text-lg font-semibold mb-1 truncate text-primary">{fileName}</h3>

                  {fileItem.description && (
                    <p className="text-sm text-muted-foreground mb-2">{fileItem.description}</p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    {fileSize && <span>{fileSize}</span>}
                    {mimeType && (
                      <>
                        <span>•</span>
                        <span className="uppercase">
                          {mimeType.split('/').pop()?.toUpperCase()}
                        </span>
                      </>
                    )}
                  </div>

                  <a
                    href={file.url || '#'}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button variant="default" className="w-full flex items-center sm:w-auto gap-2">
                      <Download className="w-4 h-4" />
                      Scarica
                    </Button>
                  </a>
                </div>
              </div>
            </SpotlightCard>
          )
        })}
      </div>
    </div>
  )
}
