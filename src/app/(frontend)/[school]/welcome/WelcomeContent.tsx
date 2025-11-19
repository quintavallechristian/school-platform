'use client'

import { usePayloadUser } from '@/hooks/usePayloadUser'
import EmptyArea from '@/components/EmptyArea/EmptyArea'
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack'
import { useState } from 'react'
import Link from 'next/link'
import {
  School,
  Home,
  Users,
  Megaphone,
  Calendar,
  Target,
  Settings,
  Lightbulb,
  BookOpen,
  MessageCircle,
  Check,
  ArrowRight,
  PartyPopper,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: LucideIcon
  link: string
  completed: boolean
}

interface WelcomeContentProps {
  schoolId: string
}

export default function WelcomeContent({ schoolId }: WelcomeContentProps) {
  const { user, loading } = usePayloadUser()

  // Onboarding checklist
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'profile',
      title: 'Completa il profilo della scuola',
      description: 'Aggiungi logo, colori e informazioni di contatto',
      icon: School,
      link: `/admin/collections/schools/${schoolId}`,
      completed: false,
    },
    {
      id: 'homepage',
      title: 'Personalizza la homepage',
      description: 'Configura la pagina principale del tuo sito',
      icon: Home,
      link: '/admin/collections/homepage',
      completed: false,
    },
    {
      id: 'chi-siamo',
      title: 'Aggiungi la sezione "Chi siamo"',
      description: 'Crea la sezione "Chi siamo"',
      icon: Users,
      link: '/admin/collections/chi-siamo',
      completed: false,
    },
    {
      id: 'teachers',
      title: 'Aggiungi gli insegnanti',
      description: 'Crea i profili del corpo docente',
      icon: Users,
      link: '/admin/collections/teachers',
      completed: false,
    },
    {
      id: 'communication',
      title: 'Pubblica la prima comunicazione',
      description: 'Invia un messaggio di benvenuto alle famiglie',
      icon: Megaphone,
      link: '/admin/collections/communications',
      completed: false,
    },
    {
      id: 'event',
      title: 'Crea un evento',
      description: 'Aggiungi il primo evento al calendario',
      icon: Calendar,
      link: '/admin/collections/events',
      completed: false,
    },
  ])

  const completedSteps = steps.filter((s) => s.completed).length
  const progress = (completedSteps / steps.length) * 100

  const toggleStep = (id: string) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)))
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <EmptyArea title="Utente non autenticato." />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="h-screen w-full overflow-hidden">
      <ScrollStack className="-mt-24 h-[calc(100vh+6rem)] px-4 md:px-0">
          <ScrollStackItem>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold flex items-center gap-3">
                <Target className="w-10 h-10" />
                Benvenuto a bardo!
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                Completa questi passaggi per iniziare a utilizzare la piattaforma
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-12">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progresso configurazione
                </span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {completedSteps}/{steps.length} completati
                </span>
              </div>
              <div className=" mt-4  w-full h-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {progress === 100 && (
              <div className="p-4 rounded-2xl bg-linear-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                <p className="text-green-700 dark:text-green-300 font-medium flex items-center gap-2">
                  <PartyPopper className="w-6 h-6" />
                  Complimenti! Hai completato la configurazione iniziale!
                </p>
              </div>
            )}
          </ScrollStackItem>
          {/* Individual Step Items */}
          {steps.map((step) => (
            <ScrollStackItem key={step.id}>
              <div className="flex items-start gap-4">

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleStep(step.id)}
                      className={`shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                        step.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-indigo-400/50 hover:border-indigo-500 hover:bg-indigo-500/10'
                      }`}
                    >
                      {step.completed && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex-1 space-y-2">
                      <h3
                        className={`font-bold text-2xl ${
                          step.completed
                            ? 'text-green-700 dark:text-green-400 line-through'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                  </div>
                      <p className="text-lg text-gray-600 dark:text-gray-400">{step.description}</p>

                  {/* Action Button */}
                  {!step.completed && (
                    <Link href={step.link} target="_blank">
                    <Button
                    variant="outline"
                    className="flex items-center gap-2 mt-4 w-full"
                    >
                        <span>Inizia</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                      </Link>
                  )}
                </div>
              </div>
            </ScrollStackItem>
          ))}

          {/* Admin Panel CTA */}
          <ScrollStackItem>
            <div className="space-y-4 text-center">
              <Settings className="w-16 h-16 mx-auto text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Pannello di Amministrazione
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Accedi al pannello admin per gestire tutti i contenuti della tua scuola
              </p>
              <Button
                asChild
                size="lg"
              >
                <Link href="/admin">
                  <span>Vai al Pannello Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </ScrollStackItem>

          {/* Help & Support */}
          <ScrollStackItem>
            <div className="space-y-4 text-center">
              <Lightbulb className="w-16 h-16 mx-auto text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Hai bisogno di aiuto?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Consulta la nostra documentazione o contatta il supporto per qualsiasi domanda sulla
                configurazione della piattaforma.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button
                  variant="outline"
                  
                >
                  <BookOpen className="w-5 h-5" />
                  Documentazione
                </Button>
                <Button>
                  <MessageCircle className="w-5 h-5" />
                  Contatta Supporto
                </Button>
              </div>
            </div>
          </ScrollStackItem>
      </ScrollStack>
    </div>
  )
}
