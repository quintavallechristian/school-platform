'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'

export const HideCreateSchoolButton: React.FC = () => {
  const { user } = useAuth()
  const [shouldHideButton, setShouldHideButton] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkEnterprisePlan = async () => {
      setIsLoading(true)

      // Super-admin può sempre creare scuole
      if (!user || user.role === 'super-admin') {
        setShouldHideButton(false)
        setIsLoading(false)
        return
      }

      // Solo school-admin sono soggetti a questa restrizione
      if (user.role !== 'school-admin') {
        setShouldHideButton(true)
        setIsLoading(false)
        return
      }

      // Verifica se lo school-admin ha almeno una scuola con piano enterprise
      if (!user.schools || user.schools.length === 0) {
        setShouldHideButton(true)
        setIsLoading(false)
        return
      }

      try {
        // Ottieni tutte le scuole dell'utente
        const schoolIds = user.schools.map((school: string | { id: string }) =>
          typeof school === 'string' ? school : school.id,
        )

        // Verifica se almeno una scuola ha piano enterprise
        const schoolChecks = await Promise.all(
          schoolIds.map(async (schoolId: string) => {
            const response = await fetch(`/api/schools/${schoolId}`)
            const school = await response.json()
            return school?.subscription?.plan === 'enterprise'
          }),
        )

        const hasEnterprisePlan = schoolChecks.some((hasEnterprise) => hasEnterprise)
        setShouldHideButton(!hasEnterprisePlan)
      } catch (error) {
        console.error('Error checking enterprise plan:', error)
        // In caso di errore, nascondi il pulsante per sicurezza
        setShouldHideButton(true)
      } finally {
        setIsLoading(false)
      }
    }

    checkEnterprisePlan()
  }, [user])

  useEffect(() => {
    // Nascondi il pulsante "Create New" usando JavaScript DOM manipulation
    if (shouldHideButton && !isLoading) {
      const hideButton = () => {
        // Cerca il pulsante "Crea Nuovo" in vari modi
        const buttons = document.querySelectorAll('a, button')
        buttons.forEach((button) => {
          const text = button.textContent?.trim().toLowerCase()
          const href = button.getAttribute('href')
          
          // Nascondi se contiene "crea nuovo" o se è il link alla creazione
          if (
            text?.includes('crea nuovo') ||
            text?.includes('create new') ||
            href?.includes('/admin/collections/schools/create')
          ) {
            ;(button as HTMLElement).style.display = 'none'
          }
        })
      }

      // Esegui subito
      hideButton()

      // Osserva cambiamenti nel DOM per nascondere il pulsante se viene aggiunto dinamicamente
      const observer = new MutationObserver(hideButton)
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      return () => {
        observer.disconnect()
      }
    }
  }, [shouldHideButton, isLoading])

  // Mostra messaggio solo se il pulsante è nascosto
  if (isLoading || !shouldHideButton) {
    return null
  }

  return '';
}

export default HideCreateSchoolButton
