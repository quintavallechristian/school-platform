// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
import { Testimonials } from './collections/Testimonials'
import { Homepage } from './collections/Homepage'
import { ChiSiamo } from './collections/ChiSiamo'
import { CalendarDays } from './collections/CalendarDays'
import { PrivacyPolicy } from './collections/PrivacyPolicy'
import { ChildUpdates } from './collections/ChildUpdates'
import { ParentAppointments } from './collections/ParentAppointments'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === 'production'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
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
    Events,
    Projects,
    EducationalOfferings,
    CalendarDays,
    Menu,
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
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: isProduction
    ? [
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
      ]
    : [],
})
