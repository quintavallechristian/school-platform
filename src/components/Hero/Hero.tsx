'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

import BlurText from '../BlurText/BlurText'
import GradientText from '../GradientText/GradientText'
import ShapeDivider, { ShapeDividerStyle } from '../ShapeDivider/ShapeDivider'
import type { Media } from '@/payload-types'

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
}) {
  // Colori di default
  const defaultPrimaryColor = '#40ffaa'
  const defaultSecondaryColor = '#4079ff'
  const defaultBackgroundPrimaryColor = '#fa8899'
  const defaultBackgroundSecondaryColor = '#228899'

  const [textGradientStartColor, setTextGradientStartColor] = useState(defaultPrimaryColor)
  const [_textGradientEndColor, _setTextGradientEndColor] = useState(defaultSecondaryColor)
  const [bgGradientStartColor, setBgGradientStartColor] = useState(defaultBackgroundPrimaryColor)
  const [bgGradientEndColor, setBgGradientEndColor] = useState(defaultBackgroundSecondaryColor)
  const [pageBackgroundColor, setPageBackgroundColor] = useState('#ffffff')
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Leggi i colori dalle CSS variables
    const rootStyles = getComputedStyle(document.documentElement)

    const primaryColor = rootStyles.getPropertyValue('--color-primary').trim()
    const secondaryColor = rootStyles.getPropertyValue('--color-secondary').trim()
    const bgPrimaryColor = rootStyles.getPropertyValue('--color-background-primary').trim()
    const bgSecondaryColor = rootStyles.getPropertyValue('--color-background-secondary').trim()

    // Ottieni il colore di background effettivo dal body
    const bodyBg = getComputedStyle(document.body).backgroundColor

    if (primaryColor && primaryColor.startsWith('#')) {
      setTextGradientStartColor(primaryColor)
    }
    if (secondaryColor && secondaryColor.startsWith('#')) {
      _setTextGradientEndColor(secondaryColor)
    }
    if (bgPrimaryColor && bgPrimaryColor.startsWith('#')) {
      setBgGradientStartColor(bgPrimaryColor)
    }
    if (bgSecondaryColor && bgSecondaryColor.startsWith('#')) {
      setBgGradientEndColor(bgSecondaryColor)
    }
    if (bodyBg) {
      setPageBackgroundColor(bodyBg)
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

  // Crea i colori per il GradientText alternando primary e secondary
  const textGradientColors = [
    textGradientStartColor,
    '#ffffff',
    textGradientStartColor,
    '#ffffff',
    textGradientStartColor,
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
