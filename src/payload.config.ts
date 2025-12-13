// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { s3Storage } from '@payloadcms/storage-s3'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical'
import { it } from '@payloadcms/translations/languages/it'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { Schools } from './collections/Schools'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { Events } from './collections/Events'
import { Projects } from './collections/Projects'
import { EducationalOfferings } from './collections/EducationalOfferings'
import { Teachers } from './collections/Teachers'
import { Menu } from './collections/Menu'
import { Communications } from './collections/Communications'
import { Gallery } from './collections/Gallery'
import { EmailSubscribers } from './collections/EmailSubscribers'
import { Documents } from './collections/Documents'
import { Homepage } from './collections/Homepage'
import { ChiSiamo } from './collections/ChiSiamo'
import { CalendarDays } from './collections/CalendarDays'
import { PrivacyPolicy } from './collections/PrivacyPolicy'
import { ChildUpdates } from './collections/ChildUpdates'
import { ParentAppointments } from './collections/ParentAppointments'
import { Testimonials } from './collections/Testimonials'
import { Subscriptions } from './collections/Subscriptions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Icon: '/components/Logo#Logo',
        Logo: '/components/LogoExtended#Logo',
      },
      providers: [
        '/components/TermsAcceptanceProvider#TermsAcceptanceProvider',
        '/components/AdminTrialGuard#AdminTrialGuard',
      ],
    },
    meta: {
      title: 'Scuole infanzia admin',
      icons: [
        {
          rel: 'icon',
          url: '/favicon.ico',
          type: 'image/icon',
        },
      ],
    },
  },
  i18n: {
    supportedLanguages: { it },
  },
  collections: [
    //Configurazione sito
    Schools,
    Homepage,
    PrivacyPolicy,
    // Contenuti
    ChiSiamo,
    Teachers,
    Projects,
    EducationalOfferings,
    CalendarDays,
    Menu,
    Events,
    // Comunicazioni scuola-famiglia
    Documents,
    Testimonials,
    Communications,
    EmailSubscribers,
    // Area genitori
    ChildUpdates,
    ParentAppointments,
    // Blog
    Articles,
    Pages,
    Media,
    Gallery,
    // Utenti
    Users,
    // Abbonamenti
    Subscriptions,
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature()],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.R2_BUCKET!,
      config: {
        endpoint: process.env.R2_ENDPOINT!,
        region: 'auto',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
      },
    }),
    multiTenantPlugin({
      // Usa Schools come collection tenant (default è 'tenants')
      tenantsSlug: 'schools',
      // Mantieni school come nome del campo tenant (default è 'tenant')
      tenantField: {
        name: 'school',
        label: 'Scuola',
      },
      // Campo nascosto sugli users che mantiene l'accesso ai tenant
      tenantsArrayField: {
        arrayFieldName: 'tenantAccess',
        arrayTenantFieldName: 'school',
        includeDefaultField: false,
      },
      debug: true,
      // Super-admin ha accesso a tutti i tenant
      userHasAccessToAllTenants: (user) => user?.role === 'super-admin',
      // Collections multi-tenant
      collections: {
        articles: {},
        events: {},
        projects: {},
        teachers: {},
        'educational-offerings': {},
        'calendar-days': {},
        menu: {},
        communications: {},
        gallery: {},
        'email-subscribers': {},
        documents: {},
        homepage: { isGlobal: true },
        'chi-siamo': { isGlobal: true },
        'privacy-policy': { isGlobal: true },
        'child-updates': {},
        'parent-appointments': {},
        testimonials: {},
        media: {},
        pages: {},
      },
    }),
  ],
  // onInit: async (payload) => {
  //   const pageSize = 500
  //   let page = 1
  //   try {
  //     while (true) {
  //       const users = await payload.find({
  //         collection: 'users',
  //         depth: 0,
  //         limit: pageSize,
  //         overrideAccess: true,
  //         page,
  //         select: {
  //           id: true,
  //           schools: true,
  //           tenantAccess: true,
  //         },
  //       })

  //       for (const user of users.docs as any[]) {
  //         const expectedAccess = buildTenantAccess(user.schools || [])
  //         if (expectedAccess.length === 0) {
  //           continue
  //         }

  //         const currentAccess = Array.isArray(user.tenantAccess)
  //           ? user.tenantAccess.map((row: any) => row?.school).filter(Boolean)
  //           : []

  //         const expectedIds = new Set(expectedAccess.map(({ school }) => school))
  //         const currentIds = new Set(currentAccess)

  //         const needsUpdate =
  //           expectedIds.size !== currentIds.size ||
  //           [...expectedIds].some((id) => !currentIds.has(id))

  //         if (needsUpdate) {
  //           await payload.update({
  //             collection: 'users',
  //             data: {
  //               tenantAccess: expectedAccess,
  //             },
  //             id: user.id,
  //             overrideAccess: true,
  //           })
  //         }
  //       }

  //       if (page >= users.totalPages) {
  //         break
  //       }
  //       page += 1
  //     }
  //   } catch (error) {
  //     payload.logger.error('Failed to sync tenant assignments', error)
  //   }
  // },
})
