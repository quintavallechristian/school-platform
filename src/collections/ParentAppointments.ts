import { CollectionConfig, Access } from 'payload'
import { assignSchoolBeforeChange, getSchoolField } from '../lib/access'

export const ParentAppointments: CollectionConfig = {
  slug: 'parent-appointments',
  labels: {
    singular: 'Appuntamento Genitore',
    plural: 'Appuntamenti Genitori',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'parent', 'status'],
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
  access: {
    // Parents vedono solo i propri appuntamenti
    read: (({ req: { user } }) => {
      if (!user) return false

      // Super-admin vede tutto
      if (user.role === 'super-admin') return true

      // Parent vede solo i propri appuntamenti
      if (user.role === 'parent') {
        return {
          parent: {
            equals: user.id,
          },
        }
      }

      // School-admin ed editor vedono appuntamenti della loro scuola
      if (
        (user.role === 'school-admin' || user.role === 'editor') &&
        user.schools &&
        user.schools.length > 0
      ) {
        const schoolIds = user.schools.map((school) =>
          typeof school === 'string' ? school : school.id,
        )
        return {
          school: {
            in: schoolIds,
          },
        }
      }

      return false
    }) as Access,
    create: ({ req: { user } }) => {
      // School-admin, editor E parent possono creare appuntamenti
      // Parent può creare solo prenotazioni (bookings)
      return (
        user?.role === 'super-admin' ||
        user?.role === 'school-admin' ||
        user?.role === 'editor' ||
        user?.role === 'parent'
      )
    },
    update: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true

      // Parent può cancellare i propri appuntamenti (cambiare status)
      if (user.role === 'parent') {
        return {
          parent: {
            equals: user.id,
          },
        }
      }

      // School-admin ed editor possono modificare appuntamenti della loro scuola
      if (
        (user.role === 'school-admin' || user.role === 'editor') &&
        user.schools &&
        user.schools.length > 0
      ) {
        const schoolIds = user.schools.map((school) =>
          typeof school === 'string' ? school : school.id,
        )
        return {
          school: {
            in: schoolIds,
          },
        }
      }

      return false
    }) as Access,
    delete: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true

      // Solo school-admin può eliminare
      if (user.role === 'school-admin' && user.schools && user.schools.length > 0) {
        const schoolIds = user.schools.map((school) =>
          typeof school === 'string' ? school : school.id,
        )
        return {
          school: {
            in: schoolIds,
          },
        }
      }

      return false
    }) as Access,
  },
  hooks: {
    beforeChange: [assignSchoolBeforeChange],
  },
  fields: [
    getSchoolField('Scuola'),
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Genitore',
      admin: {
        description: "Il genitore per cui è l'appuntamento",
        condition: (data) => {
          // Mostra il campo solo se è stata selezionata una scuola
          return !!data.school
        },
      },
      filterOptions: ({ data }) => {
        // Filtra i genitori per mostrare solo quelli della scuola selezionata con role parent
        if (data?.school) {
          const schoolId = typeof data.school === 'string' ? data.school : data.school.id
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
        // Se non c'è scuola selezionata, restituisci false per non mostrare nessun genitore
        return false
      },
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      label: 'Evento',
      admin: {
        description: 'Evento a cui si riferisce questo appuntamento (se è una prenotazione)',
      },
    },
    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'teachers',
      label: 'Insegnante',
      admin: {
        description: "Insegnante presente all'appuntamento (opzionale)",
        condition: (data) => {
          // Mostra il campo solo se è stata selezionata una scuola
          return !!data.school
        },
      },
      filterOptions: ({ data }) => {
        // Filtra gli insegnanti per mostrare solo quelli della scuola selezionata
        if (data?.school) {
          return {
            school: {
              equals: typeof data.school === 'string' ? data.school : data.school.id,
            },
          }
        }
        // Se non c'è scuola selezionata, restituisci false per non mostrare nessun bambino
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
      name: 'description',
      type: 'textarea',
      label: 'Descrizione',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Data e ora',
      admin: {
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'timeSlot',
      type: 'text',
      label: 'Fascia oraria',
      admin: {
        description: 'Fascia oraria scelta (es. 09:00-09:30)',
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Luogo',
      admin: {
        description: 'Es: "Aula 2A", "Sala Riunioni"',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Stato',
      options: [
        {
          label: 'In attesa di approvazione',
          value: 'pending',
        },
        {
          label: 'Confermato',
          value: 'confirmed',
        },
        {
          label: 'Annullato',
          value: 'cancelled',
        },
        {
          label: 'Rifiutato',
          value: 'rejected',
        },
      ],
      access: {
        // Parents possono solo cambiare a "cancelled"
        update: ({ req: { user } }) => {
          if (user?.role === 'parent') {
            // I genitori possono modificare lo status (per cancellare)
            return true
          }
          // School staff può modificare qualsiasi status
          return (
            user?.role === 'super-admin' || user?.role === 'school-admin' || user?.role === 'editor'
          )
        },
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Note post-incontro',
      admin: {
        description: "Note compilate dopo l'incontro",
      },
      access: {
        read: ({ req: { user } }) => {
          // Solo school staff può vedere le note
          return user?.role !== 'parent'
        },
        update: ({ req: { user } }) => {
          // Solo school staff può modificare le note
          return user?.role !== 'parent'
        },
      },
    },
  ],
  timestamps: true,
}
