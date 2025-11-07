import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import BlurText from '../BlurText/BlurText'
import GradientText from '../GradientText/GradientText'

export default async function Hero({
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
  return (
    <section
      className={`bg-linear-to-br from-slate-600 to-indigo-600 text-white py-24 px-8 text-center ${!big ? '' : 'min-h-screen'}`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in-up">
          <GradientText
            colors={['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa']}
            showBorder={false}
            animationSpeed={30}
          >
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
