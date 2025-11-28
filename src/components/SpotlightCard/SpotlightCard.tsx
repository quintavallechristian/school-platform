'use client'
import React, { useRef, useState, useEffect } from 'react'

interface Position {
  x: number
  y: number
}

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
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

const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  (
    {
      children,
      className = '',
      bgClassName = 'bg-linear-to-br from-white to-slate-200 dark:from-gray-900 dark:to-gray-800',
      spotlightColor,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
    const [opacity, setOpacity] = useState<number>(0)
    const [finalSpotlightColor, setFinalSpotlightColor] = useState<string>(
      spotlightColor || 'rgba(0, 229, 255, 0.2)',
    )

    // Combine refs
    useEffect(() => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(internalRef.current)
      } else {
        ref.current = internalRef.current
      }
    }, [ref])

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
      if (!internalRef.current || isFocused) return

      const rect = internalRef.current.getBoundingClientRect()
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })

      props.onMouseMove?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
      setIsFocused(true)
      setOpacity(0.6)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      setIsFocused(false)
      setOpacity(0)
      props.onBlur?.(e)
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      setOpacity(0.6)
      props.onMouseEnter?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setOpacity(0)
      props.onMouseLeave?.(e)
    }

    return (
      <div
        ref={internalRef}
        {...props}
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`shadow-xl relative z-30 rounded-3xl border overflow-hidden p-8 ${className} ${bgClassName}`}
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
  },
)

SpotlightCard.displayName = 'SpotlightCard'

export default SpotlightCard
