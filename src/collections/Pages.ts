import { CollectionConfig } from 'payload'
import {
  tenantRead,
  tenantCreate,
  tenantUpdate,
  tenantDelete,
  assignSchoolBeforeChange,
} from '../lib/access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'school', 'updatedAt'],
    group: 'Contenuti',
  },
  access: {
    read: tenantRead,
    create: tenantCreate,
    update: tenantUpdate,
    delete: tenantDelete,
  },
  hooks: {
    beforeChange: [assignSchoolBeforeChange],
  },
  fields: [
    {
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
      required: true,
      label: 'Scuola',
      admin: {
        description: 'Scuola a cui appartiene questa pagina',
        condition: (data, siblingData, { user }) => {
          return user?.role === 'super-admin'
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titolo',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL (slug)',
      admin: {
        description: 'Es: chi-siamo, contatti, storia',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Sottotitolo',
      admin: {
        description: "Testo che appare sotto il titolo nell'hero (se l'hero è abilitato)",
      },
    },
    {
      name: 'showHero',
      type: 'checkbox',
      label: 'Mostra Hero di default',
      defaultValue: true,
      admin: {
        description:
          "Se disabilitato, l'hero di default non verrà mostrato (utile se usi un blocco Hero personalizzato)",
      },
    },
    {
      name: 'heroFullHeight',
      type: 'checkbox',
      label: 'Hero a schermo intero',
      defaultValue: false,
      admin: {
        description: "Se abilitato, l'hero di default occuperà l'intera altezza dello schermo",
        condition: (data) => data.showHero === true,
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Immagine di copertina',
      admin: {
        description: "Immagine opzionale per l'hero della pagina",
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenuto principale',
      admin: {
        description: "Testo principale che appare dopo l'hero",
      },
    },
    // Blocchi componibili
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Blocchi Personalizzati',
      admin: {
        description:
          'Aggiungi sezioni personalizzate come call-to-action, team cards, feature grids, ecc.',
      },
      blocks: [
        // Blocco Hero
        {
          slug: 'hero',
          labels: {
            singular: 'Hero Section',
            plural: 'Hero Sections',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Titolo',
              admin: {
                description: 'Titolo principale con effetto gradiente animato',
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: 'Sottotitolo',
              admin: {
                description: 'Testo secondario con animazione blur',
              },
            },
            {
              name: 'fullHeight',
              type: 'checkbox',
              label: 'A schermo intero',
              defaultValue: false,
              admin: {
                description: "Se attivo, l'hero occuperà l'intera altezza dello schermo",
              },
            },
            {
              name: 'buttons',
              type: 'array',
              label: 'Pulsanti',
              maxRows: 3,
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Testo del pulsante',
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                  label: 'Link (URL)',
                },
                {
                  name: 'variant',
                  type: 'select',
                  label: 'Stile',
                  defaultValue: 'default',
                  options: [
                    { label: 'Primario', value: 'default' },
                    { label: 'Distruttivo', value: 'destructive' },
                    { label: 'Outline', value: 'outline' },
                    { label: 'Link', value: 'link' },
                  ],
                },
              ],
            },
          ],
        },
        // Blocco Call to Action
        {
          slug: 'callToAction',
          labels: {
            singular: 'Call to Action',
            plural: 'Call to Actions',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Titolo',
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: 'Sottotitolo / Descrizione',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Immagine di sfondo (opzionale)',
            },
            {
              name: 'buttons',
              type: 'array',
              label: 'Pulsanti',
              maxRows: 3,
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Testo del pulsante',
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                  label: 'Link (URL)',
                },
                {
                  name: 'variant',
                  type: 'select',
                  label: 'Stile',
                  defaultValue: 'default',
                  options: [
                    { label: 'Primario', value: 'default' },
                    { label: 'Secondario', value: 'secondary' },
                    { label: 'Outline', value: 'outline' },
                    { label: 'Ghost', value: 'ghost' },
                  ],
                },
              ],
            },
          ],
        },
        // Blocco Rich Text
        {
          slug: 'richText',
          labels: {
            singular: 'Testo Formattato',
            plural: 'Testi Formattati',
          },
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: true,
              label: 'Contenuto',
            },
          ],
        },
        // Blocco Grid di Card
        {
          slug: 'cardGrid',
          labels: {
            singular: 'Griglia di Card',
            plural: 'Griglie di Card',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Titolo della sezione (opzionale)',
            },
            {
              name: 'columns',
              type: 'select',
              label: 'Numero di colonne',
              defaultValue: '3',
              options: [
                { label: '2 colonne', value: '2' },
                { label: '3 colonne', value: '3' },
                { label: '4 colonne', value: '4' },
              ],
            },
            {
              name: 'cards',
              type: 'array',
              label: 'Card',
              fields: [
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
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Immagine',
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Link (opzionale)',
                },
              ],
            },
          ],
        },
        // Blocco File Download
        {
          slug: 'fileDownload',
          labels: {
            singular: 'File Scaricabili',
            plural: 'File Scaricabili',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Titolo della sezione (opzionale)',
              admin: {
                description: 'Es: "Documenti Utili", "Moduli da scaricare"',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Descrizione (opzionale)',
            },
            {
              name: 'files',
              type: 'array',
              label: 'File',
              minRows: 1,
              fields: [
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'File',
                  admin: {
                    description: 'PDF, DOC, XLS, o altri documenti',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titolo (opzionale)',
                  admin: {
                    description: 'Se vuoto, usa il nome del file',
                  },
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Descrizione (opzionale)',
                },
              ],
            },
          ],
        },
        // Blocco Galleria
        {
          slug: 'gallery',
          labels: {
            singular: 'Galleria',
            plural: 'Gallerie',
          },
          fields: [
            {
              name: 'gallery',
              type: 'relationship',
              relationTo: 'gallery',
              required: true,
              label: 'Galleria',
              admin: {
                description: 'Seleziona una galleria esistente da mostrare',
              },
            },
          ],
        },
        // Blocco Lista Articoli
        {
          slug: 'articleList',
          labels: {
            singular: 'Lista Articoli',
            plural: 'Liste Articoli',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Titolo della sezione (opzionale)',
              admin: {
                description: 'Es: "Ultime Notizie", "Articoli in Evidenza"',
              },
            },
            {
              name: 'limit',
              type: 'number',
              label: 'Numero di articoli da mostrare',
              defaultValue: 6,
              min: 1,
              max: 12,
              required: true,
              admin: {
                description: 'Quanti articoli mostrare (max 12)',
              },
            },
            {
              name: 'showViewAll',
              type: 'checkbox',
              label: 'Mostra pulsante "Vedi tutti"',
              defaultValue: true,
              admin: {
                description: 'Mostra un pulsante per andare alla pagina blog completa',
              },
            },
          ],
        },
        // Blocco Lista Eventi
        {
          slug: 'eventList',
          labels: {
            singular: 'Lista Eventi',
            plural: 'Liste Eventi',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Titolo della sezione (opzionale)',
              admin: {
                description: 'Es: "Prossimi Eventi", "Eventi della Scuola"',
              },
            },
            {
              name: 'limit',
              type: 'number',
              label: 'Numero di eventi da mostrare',
              defaultValue: 6,
              min: 1,
              max: 12,
              required: true,
              admin: {
                description: 'Quanti eventi mostrare (max 12)',
              },
            },
            {
              name: 'filter',
              type: 'select',
              label: 'Filtra eventi',
              defaultValue: 'all',
              options: [
                { label: 'Tutti gli eventi', value: 'all' },
                { label: 'Solo eventi futuri', value: 'upcoming' },
                { label: 'Solo eventi passati', value: 'past' },
              ],
              admin: {
                description: 'Scegli quali eventi mostrare in base alla data',
              },
            },
            {
              name: 'showViewAll',
              type: 'checkbox',
              label: 'Mostra pulsante "Vedi tutti"',
              defaultValue: true,
              admin: {
                description: 'Mostra un pulsante per andare alla pagina eventi completa',
              },
            },
          ],
        },
        // Blocco Comunicazioni
        {
          slug: 'communications',
          labels: {
            singular: 'Lista Comunicazioni',
            plural: 'Liste Comunicazioni',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Titolo della sezione (opzionale)',
              admin: {
                description: 'Es: "Comunicazioni Importanti", "Avvisi"',
              },
            },
            {
              name: 'limit',
              type: 'number',
              label: 'Numero di comunicazioni da mostrare',
              defaultValue: 10,
              min: 1,
              max: 20,
              required: true,
              admin: {
                description: 'Quante comunicazioni mostrare (max 20)',
              },
            },
            {
              name: 'priorityFilter',
              type: 'select',
              label: 'Filtra per priorità',
              hasMany: true,
              options: [
                { label: 'Bassa', value: 'low' },
                { label: 'Normale', value: 'normal' },
                { label: 'Alta', value: 'high' },
                { label: 'Urgente', value: 'urgent' },
              ],
              admin: {
                description: 'Seleziona le priorità da mostrare (se vuoto, mostra tutte)',
              },
            },
            {
              name: 'showViewAll',
              type: 'checkbox',
              label: 'Mostra pulsante "Vedi tutte"',
              defaultValue: true,
              admin: {
                description: 'Mostra un pulsante per andare alla pagina comunicazioni completa',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'showInNavbar',
      type: 'checkbox',
      label: 'Mostra nella navbar',
      defaultValue: false,
      admin: {
        description: 'Se attivo, questa pagina apparirà automaticamente nel menu di navigazione',
      },
    },
    {
      name: 'navbarOrder',
      type: 'number',
      label: 'Ordine nella navbar',
      admin: {
        description: 'Numero per ordinare le pagine nel menu (più basso = prima)',
        condition: (data) => data.showInNavbar === true,
      },
    },
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: 'gallery',
      label: 'Galleria',
      admin: {
        description: 'Collega una galleria di immagini a questa pagina (opzionale)',
      },
    },
    // SEO Fields
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'Titolo per i motori di ricerca (se vuoto, usa il titolo della pagina)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'Descrizione per i motori di ricerca (max 160 caratteri)',
          },
        },
      ],
    },
  ],
}
