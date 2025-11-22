import type { CollectionConfig } from 'payload'

export const Schools: CollectionConfig = {
  slug: 'schools',
  labels: {
    singular: 'Scuola',
    plural: 'Scuole',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'domain', 'isActive', 'createdAt'],
    group: 'Configurazione sito',
    components: {
      beforeList: [
        {
          path: '@/components/HideCreateSchoolButton',
        },
      ],
    },
  },
  access: {
    // Super-admin e school-admin possono creare scuole
    // School-admin devono avere almeno una scuola con piano enterprise (validato in beforeChange)
    create: ({ req: { user } }) => {
      return user?.role === 'super-admin' || user?.role === 'school-admin'
    },
    read: ({ req: { user } }) => {
      // Super-admin vedono tutte le scuole
      if (user?.role === 'super-admin') {
        return true
      }
      // Gli altri utenti vedono solo le loro scuole
      if (user?.schools && user.schools.length > 0) {
        return {
          id: {
            in: user.schools,
          },
        }
      }
      return false
    },

    delete: ({ req: { user } }) => {
      return user?.role === 'super-admin'
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'super-admin') {
        return true
      }
      if (user?.role === 'school-admin' && user.schools && user.schools.length > 0) {
        return {
          id: {
            in: user.schools,
          },
        }
      }
      return false
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Generale',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Nome Scuola',
                  admin: {
                    width: '50%',
                    description: 'Il nome completo della scuola',
                  },
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  label: 'Slug',
                  admin: {
                    width: '50%',
                    description: 'Identificatore univoco per URL (es: scuola-primaria-roma)',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'isActive',
                  type: 'checkbox',
                  label: 'Scuola Attiva',
                  defaultValue: false,
                  admin: {
                    width: '50%',
                    description: 'Se disattivata, il sito della scuola non sarà accessibile',
                    style: {
                      alignSelf: 'center',
                    },
                  },
                },
              ],
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              admin: {
                description: 'Logo della scuola',
              },
            },
          ],
        },
        {
          label: 'Aspetto',
          fields: [
            {
              name: 'lightTheme',
              type: 'group',
              label: 'Tema Chiaro',
              admin: {
                description: 'Colori utilizzati quando il tema chiaro è attivo',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'textPrimary',
                      type: 'text',
                      label: 'Colore Testo Primario',
                      defaultValue: '#3b82f6',
                      admin: {
                        width: '50%',
                        description: 'Colore principale del testo (tema chiaro)',
                        components: {
                          Field: '@/components/ColorPicker/ColorPickerField',
                        },
                      },
                    },
                    {
                      name: 'textSecondary',
                      type: 'text',
                      label: 'Colore Testo Secondario',
                      defaultValue: '#8b5cf6',
                      admin: {
                        width: '50%',
                        description: 'Colore secondario del testo (tema chiaro)',
                        components: {
                          Field: '@/components/ColorPicker/ColorPickerField',
                        },
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'backgroundPrimary',
                      type: 'text',
                      label: 'Colore Sfondo Primario',
                      defaultValue: '#fa8899',
                      admin: {
                        width: '50%',
                        description: 'Colore di sfondo primario (tema chiaro)',
                        components: {
                          Field: '@/components/ColorPicker/ColorPickerField',
                        },
                      },
                    },
                    {
                      name: 'backgroundSecondary',
                      type: 'text',
                      label: 'Colore Sfondo Secondario',
                      defaultValue: '#228899',
                      admin: {
                        width: '50%',
                        description: 'Colore di sfondo secondario (tema chiaro)',
                        components: {
                          Field: '@/components/ColorPicker/ColorPickerField',
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'darkTheme',
              type: 'group',
              label: 'Tema Scuro',
              admin: {
                description: 'Colori utilizzati quando il tema scuro è attivo',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'textPrimary',
                      type: 'text',
                      label: 'Colore Testo Primario',
                      defaultValue: '#60a5fa',
                      admin: {
                        width: '50%',
                        description: 'Colore principale del testo (tema scuro)',
                        components: {
                          Field: '@/components/ColorPicker/ColorPickerField',
                        },
                      },
                    },
                    {
                      name: 'textSecondary',
                      type: 'text',
                      label: 'Colore Testo Secondario',
                      defaultValue: '#a78bfa',
                      admin: {
                        width: '50%',
                        description: 'Colore secondario del testo (tema scuro)',
                        components: {
                          Field: '@/components/ColorPicker/ColorPickerField',
                        },
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'backgroundPrimary',
                      type: 'text',
                      label: 'Colore Sfondo Primario',
                      defaultValue: '#fb7185',
                      admin: {
                        width: '50%',
                        description: 'Colore di sfondo primario (tema scuro)',
                        components: {
                          Field: '@/components/ColorPicker/ColorPickerField',
                        },
                      },
                    },
                    {
                      name: 'backgroundSecondary',
                      type: 'text',
                      label: 'Colore Sfondo Secondario',
                      defaultValue: '#06b6d4',
                      admin: {
                        width: '50%',
                        description: 'Colore di sfondo secondario (tema scuro)',
                        components: {
                          Field: '@/components/ColorPicker/ColorPickerField',
                        },
                      },
                    },
                  ],
                },
              ],
            },
            // Legacy fields - kept for backward compatibility but hidden from UI
            {
              name: 'primaryColor',
              type: 'text',
              admin: {
                hidden: true,
              },
            },
            {
              name: 'secondaryColor',
              type: 'text',
              admin: {
                hidden: true,
              },
            },
            {
              name: 'backgroundPrimaryColor',
              type: 'text',
              admin: {
                hidden: true,
              },
            },
            {
              name: 'backgroundSecondaryColor',
              type: 'text',
              admin: {
                hidden: true,
              },
            },
          ],
        },
        {
          label: 'Contatti',
          fields: [
            {
              name: 'contactInfo',
              type: 'group',
              label: 'Informazioni di Contatto',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'email',
                      type: 'email',
                      label: 'Email',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'phone',
                      type: 'text',
                      label: 'Telefono',
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  name: 'address',
                  type: 'textarea',
                  label: 'Indirizzo',
                },
              ],
            },
          ],
        },
        {
          label: 'Funzionalità',
          fields: [
            {
              name: 'featureVisibility',
              type: 'group',
              label: 'Funzionalità attive',
              admin: {
                description: 'Scegli quali funzionalità mostrare nel sito della tua scuola',
                components: {
                  Field: '@/components/School/FeatureVisibilityField',
                },
              },
              fields: [
                {
                  name: 'showChiSiamo',
                  type: 'checkbox',
                  label: 'Mostra Chi Siamo',
                  defaultValue: true,
                },
                {
                  name: 'showBlog',
                  type: 'checkbox',
                  label: 'Mostra Blog',
                  defaultValue: true,
                },
                {
                  name: 'showEvents',
                  type: 'checkbox',
                  label: 'Mostra Eventi',
                  defaultValue: true,
                },
                {
                  name: 'showProjects',
                  type: 'checkbox',
                  label: 'Mostra Progetti',
                  defaultValue: false,
                },
                {
                  name: 'showEducationalOfferings',
                  type: 'checkbox',
                  label: 'Mostra Piano Offerta Formativa',
                  defaultValue: false,
                },
                {
                  name: 'showCalendar',
                  type: 'checkbox',
                  label: 'Mostra Calendario',
                  defaultValue: false,
                },
                {
                  name: 'showMenu',
                  type: 'checkbox',
                  label: 'Mostra Mensa',
                  defaultValue: false,
                },
                {
                  name: 'showDocuments',
                  type: 'checkbox',
                  label: 'Mostra Documenti',
                  defaultValue: false,
                },
                {
                  name: 'showCommunications',
                  type: 'checkbox',
                  label: 'Mostra Comunicazioni',
                  defaultValue: false,
                },
                {
                  name: 'showParentsArea',
                  type: 'checkbox',
                  label: 'Mostra Area Riservata Genitori',
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          label: 'Abbonamento',
          fields: [
            {
              name: 'subscription',
              type: 'group',
              label: 'Abbonamento',
              admin: {
                description: 'Informazioni sul piano di abbonamento',
              },
              fields: [
                {
                  name: 'plan',
                  type: 'select',
                  label: 'Piano',
                  defaultValue: 'starter',
                  options: [
                    { label: 'Starter', value: 'starter' },
                    { label: 'Professional', value: 'professional' },
                    { label: 'Enterprise', value: 'enterprise' },
                  ],
                  access: {
                    read: ({ req: { user } }) =>
                      user?.role === 'super-admin' || user?.role === 'school-admin',
                    update: ({ req: { user } }) => user?.role === 'super-admin',
                  },
                },
                {
                  name: 'isTrial',
                  type: 'checkbox',
                  label: 'Periodo di Prova',
                  defaultValue: false,
                  access: {
                    read: ({ req: { user } }) =>
                      user?.role === 'super-admin' || user?.role === 'school-admin',
                    update: ({ req: { user } }) => user?.role === 'super-admin',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'expiresAt',
                      type: 'date',
                      label: 'Scadenza Abbonamento',
                      admin: {
                        width: '33%',
                        description: 'Data di scadenza del piano corrente',
                        date: {
                          displayFormat: 'dd/MM/YYYY',
                        },
                      },
                      access: {
                        read: ({ req: { user } }) =>
                          user?.role === 'super-admin' || user?.role === 'school-admin',
                        update: ({ req: { user } }) => user?.role === 'super-admin',
                      },
                    },
                    {
                      name: 'stripeCustomerId',
                      type: 'text',
                      admin: {
                        readOnly: true,
                      },
                      access: {
                        read: ({ req: { user } }) =>
                          user?.role === 'super-admin' || user?.role === 'school-admin',
                        update: ({ req }) => req.user?.role === 'super-admin',
                      },
                    },
                  ],
                },
                {
                  type: 'ui',
                  name: 'manageSubscription',
                  admin: {
                    components: {
                      Field: '@/components/ChangePlanPortalButton',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, operation }) => {
        // Solo durante la creazione di nuove scuole
        if (operation === 'create' && req.user) {
          const user = req.user

          // Super-admin può sempre creare scuole
          if (user.role === 'super-admin') {
            return
          }

          // School-admin deve avere almeno una scuola con piano enterprise
          if (user.role === 'school-admin') {
            if (!user.schools || user.schools.length === 0) {
              throw new Error('Non hai scuole assegnate. Contatta un super-admin.')
            }

            // Ottieni le scuole dell'utente
            const schoolIds = user.schools.map((school) =>
              typeof school === 'string' ? school : school.id,
            )

            // Verifica se almeno una scuola ha piano enterprise
            const schools = await req.payload.find({
              collection: 'schools',
              where: {
                id: {
                  in: schoolIds,
                },
              },
            })

            const hasEnterprisePlan = schools.docs.some(
              (school) => school.subscription?.plan === 'enterprise',
            )

            if (!hasEnterprisePlan) {
              throw new Error(
                'È richiesto il piano Enterprise per gestire più di una scuola.',
              )
            }
          }
        }
      },
    ],
  },
  timestamps: true,
}
