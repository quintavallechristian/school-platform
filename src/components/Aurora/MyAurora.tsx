'use client'
import { useEffect, useState } from 'react'
import Aurora from './Aurora'

export function MyAurora() {
  const [colors, setColors] = useState(['#ef93ff', '#f6d4e4', '#1a3153', '#0c5777'])

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement)

    const bgPrimary = rootStyles.getPropertyValue('--color-background-primary').trim()
    const bgSecondary = rootStyles.getPropertyValue('--color-background-secondary').trim()
    const primary = rootStyles.getPropertyValue('--color-primary').trim()
    const secondary = rootStyles.getPropertyValue('--color-secondary').trim()

    const colorArray = []

    if (bgPrimary && bgPrimary.startsWith('#')) colorArray.push(bgPrimary)
    if (bgSecondary && bgSecondary.startsWith('#')) colorArray.push(bgSecondary)
    if (primary && primary.startsWith('#')) colorArray.push(primary)
    if (secondary && secondary.startsWith('#')) colorArray.push(secondary)

    if (colorArray.length >= 3) {
      setColors(colorArray)
    }
  }, [])

  return <Aurora colorStops={colors} blend={0.3} amplitude={0.8} speed={1} />
}
