'use client'
import { useEffect, useState } from 'react'
import Aurora from './Aurora'

export function MyAurora() {
  const [colors, setColors] = useState(['#ef93ff', '#f6d4e4', '#1a3153', '#0c5777'])

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement)

    const bgPrimary = rootStyles.getPropertyValue('--color-background-primary').trim()
    const bgSecondary = rootStyles.getPropertyValue('--color-background-secondary').trim()

    // Usa solo i colori di sfondo primario e secondario
    // Crea un gradiente con 3 stop: bgPrimary -> bgSecondary -> bgPrimary
    if (bgPrimary && bgPrimary.startsWith('#') && bgSecondary && bgSecondary.startsWith('#')) {
      setColors([bgPrimary, bgSecondary, bgPrimary])
    }
  }, [])

  return <Aurora colorStops={colors} blend={0.3} amplitude={0.8} speed={1} />
}
