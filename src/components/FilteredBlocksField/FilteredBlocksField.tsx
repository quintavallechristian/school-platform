'use client'

import { BlocksField, useAuth, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'
import type { BlocksFieldClientProps } from 'payload'
import type { School } from '@/payload-types'

export const FilteredBlocksField: React.FC<BlocksFieldClientProps> = (props) => {
  const { user } = useAuth()
  const { id } = useDocumentInfo()
  const schoolField = useFormFields(([fields]) => fields.school)
  const [filteredBlocks, setFilteredBlocks] = useState(props.field.blocks)

  useEffect(() => {
    const filterBlocks = async () => {
      // Super-admin vede tutti i blocchi
      if (user?.role === 'super-admin' || !user) {
        setFilteredBlocks(props.field.blocks)
        return
      }

      // Se l'utente non ha scuole, mostra solo blocchi generali
      if (!user.schools || user.schools.length === 0) {
        const generalBlocks = [
          'hero',
          'callToAction',
          'richText',
          'cardGrid',
          'fileDownload',
          'gallery',
          'testimonialsList',
        ]
        const filtered = props.field.blocks.filter((block) => generalBlocks.includes(block.slug))
        setFilteredBlocks(filtered)
        return
      }

      try {
        // Ottieni la scuola dell'utente o del documento
        let schoolId: string | undefined

        // Se stiamo modificando un documento esistente, usa la scuola del documento
        if (id && schoolField?.value) {
          schoolId =
            typeof schoolField.value === 'string'
              ? schoolField.value
              : (schoolField.value as { id: string }).id
        } else if (user.schools && user.schools.length > 0) {
          // Altrimenti usa la prima scuola dell'utente
          schoolId = typeof user.schools[0] === 'string' ? user.schools[0] : user.schools[0].id
        }

        if (!schoolId) {
          setFilteredBlocks(props.field.blocks)
          return
        }

        // Fetch della scuola
        const response = await fetch(`/api/schools/${schoolId}`, {
          credentials: 'include',
        })

        if (!response.ok) {
          setFilteredBlocks(props.field.blocks)
          return
        }

        const school: School = await response.json()

        if (!school?.featureVisibility) {
          setFilteredBlocks(props.field.blocks)
          return
        }

        const { featureVisibility } = school

        // Mappa dei blocchi alle rispettive funzionalità
        const blockFeatureMap: Record<string, keyof typeof featureVisibility | null> = {
          hero: null,
          callToAction: null,
          richText: null,
          cardGrid: null,
          fileDownload: null,
          gallery: null,
          testimonialsList: null,
          articleList: 'showBlog',
          eventList: 'showEvents',
          projectList: 'showProjects',
          educationalOfferingList: 'showEducationalOfferings',
          communications: 'showCommunications',
          teacherList: 'showTeachers',
        }

        // Filtra i blocchi
        const filtered = props.field.blocks.filter((block) => {
          const featureKey = blockFeatureMap[block.slug]

          // Blocchi generali sempre visibili
          if (featureKey === null) {
            return true
          }

          // Controlla se la funzionalità è abilitata
          const isEnabled = featureVisibility[featureKey]

          // Default values per retrocompatibilità
          if (isEnabled === undefined) {
            const defaults: Record<string, boolean> = {
              showBlog: true,
              showEvents: false,
              showProjects: false,
              showEducationalOfferings: false,
              showCommunications: false,
              showTeachers: false,
            }
            return defaults[featureKey] ?? true
          }

          return isEnabled
        })

        setFilteredBlocks(filtered)
      } catch (error) {
        console.error('Error filtering blocks:', error)
        // In caso di errore, mostra tutti i blocchi
        setFilteredBlocks(props.field.blocks)
      }
    }

    filterBlocks()
  }, [user, props.field.blocks, schoolField?.value, id])

  // Crea un nuovo oggetto field con i blocchi filtrati
  const fieldWithFilteredBlocks = {
    ...props.field,
    blocks: filteredBlocks,
  }

  return <BlocksField {...props} field={fieldWithFilteredBlocks} />
}
