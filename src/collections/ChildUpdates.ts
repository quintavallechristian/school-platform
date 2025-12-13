import { CollectionConfig } from 'payload'
import { filterBySchool } from '../lib/access'
import { createPlanGuardHook } from '../lib/subscriptionAccess'

export const ChildUpdates: CollectionConfig = {
  slug: 'child-updates',
  labels: {
    singular: 'Aggiornamento Bambino',
    plural: 'Aggiornamenti Bambini',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'type', 'publishedAt'],
    group: 'Area genitori',
    components: {
      beforeList: [
        {
          path: '@/components/UpgradeMessage',
          clientProps: {
            requiredPlan: 'professional',
            featureName: 'Area Genitori',
            featureFlag: 'showParentsArea',
          },
        },
      ],
    },
  },
  hooks: {
    beforeChange: [
      createPlanGuardHook({
        requiredPlan: 'professional',
        featureName: 'Area Genitori',
        featureFlag: 'showParentsArea',
      }),
    ],
  },
  access: {
    // Access control personalizzato per i genitori
    // Il plugin gestisce il filtro tenant, ma aggiungiamo logica per i genitori
    read: ({ req: { user } }) => {
      if (!user) return false

      // Super-admin vede tutto (via plugin)
      if (user.role === 'super-admin') return true

      // Parent vede solo i propri updates
      if (user.role === 'parent') {
        return {
          parent: {
            equals: user.id,
          },
        } as any
      }

      // School-admin ed editor: il plugin gestisce il filtro tenant
      return true
    },
    // create, update, delete gestiti dal plugin multi-tenant
  },
  fields: [
    // Campo school gestito automaticamente dal plugin
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Genitore',
      admin: {
        description: 'Il genitore a cui si riferisce questo aggiornamento',
      },
      filterOptions: ({ data, user }) => {
        // Determina la scuola da usare per il filtro
        let schoolId: string | undefined

        // Prima prova con data.school (se è stato selezionato nel form)
        if (data?.school) {
          schoolId = typeof data.school === 'string' ? data.school : data.school.id
        }
        // Altrimenti usa la scuola dell'utente (per school-admin con una sola scuola)
        else if (user?.schools && user.schools.length > 0) {
          const firstSchool = user.schools[0]
          schoolId = typeof firstSchool === 'string' ? firstSchool : firstSchool.id
        }

        // Se abbiamo una scuola, filtra i genitori
        if (schoolId) {
          return {
            and: [
              {
                schools: {
                  contains: schoolId,
                },
              },
              {
                role: {
                  equals: 'parent',
                },
              },
            ],
          } as any
        }

        // Se non c'è scuola disponibile, non mostrare nessun genitore
        return false
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titolo',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Contenuto',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'daily_activity',
      label: 'Tipo',
      options: [
        {
          label: 'Attività giornaliera',
          value: 'daily_activity',
        },
        {
          label: 'Traguardo raggiunto',
          value: 'achievement',
        },
        {
          label: 'Nota importante',
          value: 'note',
        },
        {
          label: 'Evento speciale',
          value: 'event',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Foto',
      admin: {
        description: 'Foto delle attività svolte',
      },
      filterOptions: filterBySchool,
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Data pubblicazione',
      admin: {
        position: 'sidebar',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
    },
  ],
  timestamps: true,
}
