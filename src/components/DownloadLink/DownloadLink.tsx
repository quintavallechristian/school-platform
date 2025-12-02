'use client'

import { ReactNode } from 'react'
import { trackFileDownload } from '@/lib/analytics'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DownloadLinkProps {
  url: string
  fileName: string
  mimeType?: string
  category?: string
  className?: string
  children?: ReactNode
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg'
  asChild?: boolean
}

export default function DownloadLink({
  url,
  fileName,
  mimeType,
  category = 'Documenti',
  className,
  children,
  variant = 'default',
  size = 'default',
  asChild = false,
}: DownloadLinkProps) {
  const handleClick = () => {
    trackFileDownload(fileName, url, mimeType?.split('/').pop() || undefined, category)
  }

  if (asChild) {
    return (
      <div onClick={handleClick} className="inline-block">
        <a href={url} download target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </div>
    )
  }

  return (
    <a
      href={url}
      download
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn('inline-block', className)}
    >
      <Button variant={variant} size={size} className="w-full flex items-center gap-2">
        {!children && <Download className="h-4 w-4" />}
        {children || 'Scarica'}
      </Button>
    </a>
  )
}
