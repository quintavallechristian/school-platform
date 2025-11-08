import { CollectionConfig } from 'payload'
import { tenantRead, tenantCreate, tenantUpdate, tenantDelete, assignSchoolBeforeChange } from '../lib/access'

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
        description: "Testo che appare sotto il titolo nell'hero",
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
