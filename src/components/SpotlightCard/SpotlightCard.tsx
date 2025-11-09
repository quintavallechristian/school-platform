'use client'
import React, { useRef, useState, useEffect } from 'react'

interface Position {
  x: number
  y: number
}

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string
  bgClassName?: string
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`
}

/**
 * Converts a hex color to rgba format with specified opacity
 */
function hexToRgba(hex: string, opacity: number = 0.2): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '')

  // Parse hex values
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  bgClassName = 'bg-linear-to-br from-white to-slate-200 dark:from-gray-900 dark:to-gray-800',
  spotlightColor,
}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState<number>(0)
  const [finalSpotlightColor, setFinalSpotlightColor] = useState<string>(
    spotlightColor || 'rgba(0, 229, 255, 0.2)',
  )

  // Get school primary color from CSS variable on mount
  useEffect(() => {
    if (spotlightColor) {
      setFinalSpotlightColor(spotlightColor)
      return
    }

    // Get the primary color from CSS variable
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary')
      .trim()

    if (primaryColor && primaryColor.startsWith('#')) {
      setFinalSpotlightColor(hexToRgba(primaryColor, 0.2))
    }
  }, [spotlightColor])

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current || isFocused) return

    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleFocus = () => {
    setIsFocused(true)
    setOpacity(0.6)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setOpacity(0)
  }

  const handleMouseEnter = () => {
    setOpacity(0.6)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`shadow-xl relative z-10 rounded-3xl border overflow-hidden p-8 ${className} ${bgClassName}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${finalSpotlightColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  )
}

export default SpotlightCard
