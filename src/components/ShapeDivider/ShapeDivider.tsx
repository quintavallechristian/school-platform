'use client'

import React from 'react'

export type ShapeDividerStyle =
  | 'wave'
  | 'wave-brush'
  | 'waves'
  | 'zigzag'
  | 'triangle'
  | 'triangle-asymmetric'
  | 'curve'
  | 'curve-asymmetric'
  | 'tilt'
  | 'arrow'
  | 'split'
  | 'clouds'
  | 'mountains'

export type ShapeDividerPosition = 'top' | 'bottom'

interface ShapeDividerProps {
  style: ShapeDividerStyle
  position: ShapeDividerPosition
  color?: string
  flip?: boolean
  invert?: boolean
  height?: number
  className?: string
}

// SVG paths per ogni stile
const shapePaths: Record<ShapeDividerStyle, string> = {
  wave: 'M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z',

  'wave-brush':
    'M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z',

  waves:
    'M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z',

  zigzag:
    'M0,0 L50,100 L100,0 L150,100 L200,0 L250,100 L300,0 L350,100 L400,0 L450,100 L500,0 L550,100 L600,0 L650,100 L700,0 L750,100 L800,0 L850,100 L900,0 L950,100 L1000,0 L1050,100 L1100,0 L1150,100 L1200,0 V120 H0 Z',

  triangle: 'M0,0 L600,100 L1200,0 V120 H0 Z',

  'triangle-asymmetric': 'M0,0 L900,100 L1200,0 V120 H0 Z',

  curve: 'M0,0 Q600,100 1200,0 V120 H0 Z',

  'curve-asymmetric': 'M0,0 Q800,100 1200,0 V120 H0 Z',

  tilt: 'M0,0 L1200,100 V120 H0 Z',

  arrow: 'M0,0 L600,100 L1200,0 L1050,50 L600,120 L150,50 Z',

  split: 'M0,0 L600,50 L1200,0 V120 H600 V70 L0,120 Z',

  clouds:
    'M0,100 Q150,50 300,80 T600,90 T900,70 T1200,90 V120 H0 Z M0,120 Q200,70 400,95 T800,85 T1200,100 V120 H0 Z',

  mountains:
    'M0,100 L200,50 L400,70 L600,30 L800,60 L1000,40 L1200,80 V120 H0 Z M0,120 L150,90 L300,100 L450,80 L600,95 L750,85 L900,95 L1050,88 L1200,100 V120 H0 Z',
}

export default function ShapeDivider({
  style,
  position,
  color = 'currentColor',
  flip = false,
  invert = false,
  height = 100,
  className = '',
}: ShapeDividerProps) {
  const path = shapePaths[style]

  // Calcola la trasformazione
  let transform = ''
  if (flip) {
    transform += 'scaleX(-1) '
  }

  // Per i divisori bottom, invertiamo sempre verticalmente di default
  // L'opzione "invert" permette di annullare questa inversione automatica
  const shouldInvertY = position === 'bottom' ? !invert : invert

  if (shouldInvertY) {
    transform += 'scaleY(-1) '
  }

  return (
    <div
      className={`absolute left-0 w-full overflow-hidden leading-none ${
        position === 'top' ? 'top-0' : 'bottom-0'
      } ${className}`}
      style={{
        height: `${height}px`,
        zIndex: 10,
      }}
    >
      <svg
        className="relative block w-full"
        style={{
          height: `${height}px`,
          transform: transform.trim() || undefined,
        }}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={path} fill={color} />
      </svg>
    </div>
  )
}
