'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import BlurText from '../BlurText/BlurText'
import GradientText from '../GradientText/GradientText'

export default function Hero({
  title,
  subtitle,
  buttons,
  big = false,
}: {
  title: string
  subtitle?: string
  buttons?: {
    text: string
    href: string
    variant?: 'default' | 'destructive' | 'outline' | 'link'
  }[]
  big?: boolean
}) {
  // Colori di default
  const defaultPrimaryColor = '#40ffaa'
  const defaultSecondaryColor = '#4079ff'
  const defaultBackgroundPrimaryColor = '#fa8899'
  const defaultBackgroundSecondaryColor = '#228899'

  const [textGradientStartColor, setTextGradientStartColor] = useState(defaultPrimaryColor)
  const [textGradientEndColor, setTextGradientEndColor] = useState(defaultSecondaryColor)
  const [bgGradientStartColor, setBgGradientStartColor] = useState(defaultBackgroundPrimaryColor)
  const [bgGradientEndColor, setBgGradientEndColor] = useState(defaultBackgroundSecondaryColor)

  useEffect(() => {
    // Leggi i colori dalle CSS variables
    const rootStyles = getComputedStyle(document.documentElement)

    const primaryColor = rootStyles.getPropertyValue('--color-primary').trim()
    const secondaryColor = rootStyles.getPropertyValue('--color-secondary').trim()
    const bgPrimaryColor = rootStyles.getPropertyValue('--color-background-primary').trim()
    const bgSecondaryColor = rootStyles.getPropertyValue('--color-background-secondary').trim()

    if (primaryColor && primaryColor.startsWith('#')) {
      setTextGradientStartColor(primaryColor)
    }
    if (secondaryColor && secondaryColor.startsWith('#')) {
      setTextGradientEndColor(secondaryColor)
    }
    if (bgPrimaryColor && bgPrimaryColor.startsWith('#')) {
      setBgGradientStartColor(bgPrimaryColor)
    }
    if (bgSecondaryColor && bgSecondaryColor.startsWith('#')) {
      setBgGradientEndColor(bgSecondaryColor)
    }
  }, [])

  // Crea i colori per il GradientText alternando primary e secondary
  const textGradientColors = [
    textGradientStartColor,
    textGradientEndColor,
    textGradientStartColor,
    textGradientEndColor,
    textGradientStartColor,
  ]

  return (
    <section
      className={`py-24 px-8 text-center ${!big ? '' : 'min-h-screen'}`}
      style={{
        background: `linear-gradient(to bottom right, ${bgGradientStartColor}, ${bgGradientEndColor})`,
      }}
    >
      <div className="max-w-4xl mx-auto">
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
              className="text-2xl mb-8"
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
    </section>
  )
}
