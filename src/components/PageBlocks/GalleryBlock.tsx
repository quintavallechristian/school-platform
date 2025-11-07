import React from 'react'
import { Gallery as GalleryType } from '@/payload-types'
import GalleryView from '../GalleryView/GalleryView'

type GalleryBlock = {
  gallery: string | GalleryType
  id?: string | null
  blockName?: string | null
  blockType: 'gallery'
}

type Props = {
  block: GalleryBlock
}

export default async function GalleryBlock({ block }: Props) {
  const gallery = block.gallery

  // Se la gallery è solo un ID (string), dobbiamo fetchare i dati
  if (typeof gallery === 'string') {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/gallery/${gallery}`, {
        cache: 'no-store',
      })
      if (!response.ok) {
        console.error('Failed to fetch gallery')
        return null
      }
      const galleryData = (await response.json()) as GalleryType
      return <GalleryView gallery={galleryData} />
    } catch (error) {
      console.error('Error fetching gallery:', error)
      return null
    }
  }

  // Se è già un oggetto completo, lo usiamo direttamente
  if (gallery && typeof gallery === 'object') {
    return <GalleryView gallery={gallery as GalleryType} />
  }

  return null
}
