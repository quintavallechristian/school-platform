// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { it } from '@payloadcms/translations/languages/it'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Schools } from './collections/Schools'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { Events } from './collections/Events'
import { Projects } from './collections/Projects'
import { Teachers } from './collections/Teachers'
import { Menu } from './collections/Menu'
import { Pages } from './collections/Pages'
import { Communications } from './collections/Communications'
import { Gallery } from './collections/Gallery'
import { EmailSubscribers } from './collections/EmailSubscribers'
import { Documents } from './collections/Documents'
import { Testimonials } from './collections/Testimonials'
import { Homepage } from './globals/Homepage'
import { ChiSiamo } from './globals/ChiSiamo'
import { CalendarDays } from './collections/CalendarDays'
import { PrivacyPolicy } from './globals/PrivacyPolicy'
import { CookiePolicy } from './globals/CookiePolicy'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
  globals: [Homepage, ChiSiamo, PrivacyPolicy, CookiePolicy],
  collections: [
    Users,
    Schools,
    // Contenuti
    Projects,
    Teachers,
    CalendarDays,
    Events,
    Menu,
    //Scuola e genitori
    Documents,
    Communications,
    Testimonials,
    // Blog
    Articles,
    Pages,
    // Media
    Media,
    Gallery,
    // Newsletter
    EmailSubscribers,
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
  plugins: [
    // storage-adapter-placeholder
  ],
})
