'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Gallery as GalleryType, Media } from '@/payload-types'

interface GalleryViewProps {
  gallery: GalleryType
}

export default function GalleryView({ gallery }: GalleryViewProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  if (!gallery.images || gallery.images.length === 0) {
    return null
  }

  // Ordina le immagini per il campo 'order' se disponibile
  const sortedImages = [...gallery.images].sort((a, b) => {
    const orderA = a.order || 999
    const orderB = b.order || 999
    return orderA - orderB
  })

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % sortedImages.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + sortedImages.length) % sortedImages.length)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      {gallery.title && <h2 className="text-3xl font-bold mb-2">{gallery.title}</h2>}
      {gallery.description && <p className="text-muted-foreground mb-6">{gallery.description}</p>}

      {/* Griglia di immagini */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedImages.map((item, index) => {
          const image = item.image as Media
          if (!image || typeof image === 'string') return null

          return (
            <button
              key={item.id || index}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square overflow-hidden rounded-lg bg-muted hover:opacity-90 transition-opacity cursor-pointer"
              aria-label={`Visualizza immagine: ${item.caption || image.alt || 'Immagine galleria'}`}
            >
              <Image
                src={image.url || ''}
                alt={item.caption || image.alt || 'Immagine galleria'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.caption}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-light z-10"
            aria-label="Chiudi lightbox"
          >
            ×
          </button>

          {/* Freccia sinistra */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-4 text-white hover:text-gray-300 text-5xl font-light z-10"
            aria-label="Immagine precedente"
          >
            ‹
          </button>

          {/* Freccia destra */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-4 text-white hover:text-gray-300 text-5xl font-light z-10"
            aria-label="Immagine successiva"
          >
            ›
          </button>

          {/* Immagine corrente */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const currentItem = sortedImages[selectedImage]
              const currentImage = currentItem.image as Media
              if (!currentImage || typeof currentImage === 'string') return null

              return (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={currentImage.url || ''}
                      alt={currentItem.caption || currentImage.alt || 'Immagine galleria'}
                      fill
                      className="object-contain"
                      sizes="90vw"
                      priority
                    />
                  </div>
                  {currentItem.caption && (
                    <p className="text-white text-center mt-4 text-lg">{currentItem.caption}</p>
                  )}
                  <p className="text-white/60 text-center mt-2 text-sm">
                    {selectedImage + 1} / {sortedImages.length}
                  </p>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
