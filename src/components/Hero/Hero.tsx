'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

import BlurText from '../BlurText/BlurText'
import GradientText from '../GradientText/GradientText'
import ShapeDivider, { ShapeDividerStyle } from '../ShapeDivider/ShapeDivider'
import type { Media } from '@/payload-types'
import { MyAurora } from '../Aurora/MyAurora'

export default function Hero({
  title,
  subtitle,
  buttons,
  big = false,
  backgroundImage,
  parallax = false,
  gradientOverlay = false,
  topDivider,
  bottomDivider,
  logo,
  children,
}: {
  title: string
  subtitle?: string
  buttons?: {
    text: string
    href: string
    variant?: 'default' | 'destructive' | 'outline' | 'link'
  }[]
  big?: boolean
  backgroundImage?: Media | string | null
  parallax?: boolean
  gradientOverlay?: boolean
  topDivider?: {
    style: ShapeDividerStyle
    color?: string
    flip?: boolean
    invert?: boolean
    height?: number
  }
  bottomDivider?: {
    style: ShapeDividerStyle
    color?: string
    flip?: boolean
    invert?: boolean
    height?: number
  }
  logo?: React.ReactNode
  children?: React.ReactNode
}) {
  // Colori di default conformi WCAG 2.1 AA (allineati con layout.tsx)
  const defaultPrimaryColor = '#ea580c' // Arancione vibrante
  const defaultSecondaryColor = '#f59e0b' // Giallo ambrato
  const defaultBackgroundPrimaryColor = '#ffffff' // Bianco
  const defaultBackgroundSecondaryColor = '#f3f4f6' // Grigio chiaro

  const [textGradientStartColor, setTextGradientStartColor] = useState(defaultPrimaryColor)
  const [textGradientEndColor, setTextGradientEndColor] = useState(defaultSecondaryColor)
  const [bgGradientStartColor, setBgGradientStartColor] = useState(defaultBackgroundPrimaryColor)
  const [bgGradientEndColor, setBgGradientEndColor] = useState(defaultBackgroundSecondaryColor)
  const [pageBackgroundColor, setPageBackgroundColor] = useState('#ffffff')
  const [_isDarkMode, _setIsDarkMode] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Funzione per aggiornare i colori
    const updateColors = () => {
      // Leggi i colori dalle CSS variables
      const rootStyles = getComputedStyle(document.documentElement)

      let primaryColor = rootStyles.getPropertyValue('--color-primary').trim()
      if (!primaryColor) primaryColor = rootStyles.getPropertyValue('--primary').trim()

      let secondaryColor = rootStyles.getPropertyValue('--color-secondary').trim()
      if (!secondaryColor) secondaryColor = rootStyles.getPropertyValue('--secondary').trim()

      let bgPrimaryColor = rootStyles.getPropertyValue('--color-background-primary').trim()
      if (!bgPrimaryColor) bgPrimaryColor = rootStyles.getPropertyValue('--background').trim()

      let bgSecondaryColor = rootStyles.getPropertyValue('--color-background-secondary').trim()
      if (!bgSecondaryColor) bgSecondaryColor = rootStyles.getPropertyValue('--muted').trim()

      // Ottieni il colore di background effettivo dal body
      const bodyBg = getComputedStyle(document.body).backgroundColor

      // Rileva se siamo in dark mode (preparato per uso futuro)
      const isDark = document.documentElement.classList.contains('dark')
      _setIsDarkMode(isDark)

      // Funzione helper per convertire qualsiasi formato colore in hex
      const normalizeColor = (color: string): string | null => {
        if (!color) return null

        // Se è già hex, ritorna direttamente
        if (color.startsWith('#')) return color

        // Altrimenti, usa un elemento temporaneo per convertire
        const temp = document.createElement('div')
        temp.style.color = color
        document.body.appendChild(temp)
        const computed = getComputedStyle(temp).color
        document.body.removeChild(temp)

        // Converti rgb/rgba in hex
        const match = computed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (match) {
          const r = parseInt(match[1]).toString(16).padStart(2, '0')
          const g = parseInt(match[2]).toString(16).padStart(2, '0')
          const b = parseInt(match[3]).toString(16).padStart(2, '0')
          return `#${r}${g}${b}`
        }

        return null
      }

      const normalizedPrimary = normalizeColor(primaryColor)
      const normalizedSecondary = normalizeColor(secondaryColor)
      const normalizedBgPrimary = normalizeColor(bgPrimaryColor)
      const normalizedBgSecondary = normalizeColor(bgSecondaryColor)

      if (normalizedPrimary) {
        setTextGradientStartColor(normalizedPrimary)
      }
      if (normalizedSecondary) {
        setTextGradientEndColor(normalizedSecondary)
      }
      if (normalizedBgPrimary) {
        setBgGradientStartColor(normalizedBgPrimary)
      }
      if (normalizedBgSecondary) {
        setBgGradientEndColor(normalizedBgSecondary)
      }
      if (bodyBg) {
        setPageBackgroundColor(bodyBg)
      }
    }

    // Aggiorna i colori al mount
    updateColors()

    // Osserva i cambiamenti alla classe 'dark' sull'elemento html
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // Quando cambia la classe (dark mode toggle), aggiorna i colori
          updateColors()
        }
      })
    })

    // Inizia ad osservare l'elemento html
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // Cleanup: rimuovi l'observer quando il componente viene smontato
    return () => {
      observer.disconnect()
    }
  }, [])

  // Effetto parallax
  useEffect(() => {
    if (!parallax || !backgroundImage) return

    const handleScroll = () => {
      if (!heroRef.current) return

      const rect = heroRef.current.getBoundingClientRect()
      const scrollProgress = -rect.top

      setScrollY(scrollProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Chiamata iniziale
    return () => window.removeEventListener('scroll', handleScroll)
  }, [parallax, backgroundImage])

  // Crea i colori per il GradientText usando i colori della scuola
  const textGradientColors = [
    textGradientStartColor, // Primary color
    textGradientEndColor, // Secondary color
    textGradientStartColor, // Primary color
    textGradientEndColor, // Secondary color
    textGradientStartColor, // Primary color
  ]

  // Prepara l'URL dell'immagine di sfondo
  const bgImageUrl =
    backgroundImage && typeof backgroundImage === 'object' ? backgroundImage.url : null

  return (
    <section
      ref={heroRef}
      className={`relative py-24 px-8 text-center overflow-hidden ${big ? 'min-h-screen flex items-center justify-center' : ''}`}
      style={{
        background: bgImageUrl
          ? 'transparent'
          : `linear-gradient(to bottom right, ${bgGradientStartColor}, ${bgGradientEndColor})`,
      }}
    >
      <div className="absolute inset-0 z-20 opacity-20 pointer-events-none">
        <MyAurora />
      </div>
      {/* Immagine di sfondo con parallax opzionale */}
      {bgImageUrl && (
        <>
          <div
            className="absolute z-0"
            style={{
              top: parallax ? '-25%' : '0',
              left: '0',
              right: '0',
              bottom: parallax ? '-25%' : '0',
              transform: parallax ? `translateY(${scrollY * 0.3}px)` : undefined,
              willChange: parallax ? 'transform' : undefined,
            }}
          >
            <Image src={bgImageUrl} alt="" fill className="object-cover" priority quality={90} />
          </div>
          {/* Overlay gradiente per migliorare la leggibilità */}
          {gradientOverlay && (
            <div
              className="absolute inset-0 z-0"
              style={{
                background: `linear-gradient(to bottom right, ${bgGradientStartColor}cc, ${bgGradientEndColor}cc)`,
              }}
            />
          )}
        </>
      )}

      {topDivider && (
        <ShapeDivider
          style={topDivider.style}
          position="top"
          color={topDivider.color || pageBackgroundColor}
          flip={topDivider.flip}
          invert={topDivider.invert}
          height={topDivider.height}
        />
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        {logo && <div className="flex justify-center mb-8 animate-fade-in-up">{logo}</div>}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in-up">
          <GradientText colors={textGradientColors} showBorder={false} animationSpeed={30}>
            <div className="my-2 py-2">{title}</div>
          </GradientText>
        </h1>
        {subtitle && (
          <div className="flex justify-center">
            <BlurText
              text={subtitle}
              delay={150}
              animateBy="words"
              direction="top"
              className="text-2xl mb-8 text-center"
            />
          </div>
        )}
        <div className="flex gap-4 justify-center flex-wrap animate-fade-in-up-delay-400">
          {buttons &&
            buttons.map((button, index) => (
              <Link key={index} href={button.href}>
                <Button variant={button.variant || 'default'}>{button.text}</Button>
              </Link>
            ))}
          {children}
        </div>
      </div>

      {bottomDivider && (
        <ShapeDivider
          style={bottomDivider.style}
          position="bottom"
          color={bottomDivider.color || pageBackgroundColor}
          flip={bottomDivider.flip}
          invert={bottomDivider.invert}
          height={bottomDivider.height}
        />
      )}
    </section>
  )
}
