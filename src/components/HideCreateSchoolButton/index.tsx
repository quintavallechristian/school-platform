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

  return (
    <div
      style={{
        padding: '2rem',
        margin: '0 0 2rem 0',
        backgroundColor: '#FEF3C7',
        border: '2px solid #F59E0B',
        borderRadius: '8px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#92400E',
        }}
      >
        Creazione scuole non disponibile
      </h2>
      <p style={{ fontSize: '1rem', color: '#78350F', marginBottom: '1rem' }}>
        Per creare nuove scuole devi avere almeno una scuola con piano{' '}
        <strong>Enterprise</strong>.
      </p>
      <p style={{ fontSize: '0.875rem', color: '#78350F', marginBottom: '1.5rem' }}>
        Aggiorna il piano di una delle tue scuole per sbloccare questa funzionalità.
      </p>
      <Link
        href="/admin/collections/schools"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#F59E0B',
          color: 'white',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#D97706')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#F59E0B')}
      >
        Gestisci le tue scuole
      </Link>
    </div>
  )
}

export default HideCreateSchoolButton
