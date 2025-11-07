import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import BlurText from '../BlurText/BlurText'
import GradientText from '../GradientText/GradientText'

export default async function ArticleHero({
  title,
  subtitle,
  buttons,
  author,
  cover,
  date,
  big = false,
}: {
  title: string
  subtitle?: string
  buttons?: {
    text: string
    href: string
    variant?: 'default' | 'destructive' | 'outline' | 'link'
  }[]
  author?: string
  cover?: string | null
  big?: boolean
  date?: string | null
}) {
  return (
    <section
      className={`relative text-white py-24 px-8 text-center ${!big ? '' : 'min-h-screen'}`}
      style={{
        backgroundImage: cover
          ? `url(${cover})`
          : 'linear-gradient(to bottom right, rgb(71 85 105), rgb(79 70 229))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-slate-900/70 to-slate-800/70"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-wrap gap-4 mb-6 text-sm opacity-90">
          {date && (
            <time dateTime={date}>
              {new Date(date).toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          )}
          {author && <span className="pl-4 border-l-2 border-white/50">Di {author}</span>}
        </div>
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
