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
import { CalendarDays } from './collections/CalendarDays'
import { Communications } from './collections/Communications'
import { Gallery } from './collections/Gallery'
import { EmailSubscribers } from './collections/EmailSubscribers'

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
  collections: [
    Users,
    Schools,
    Media,
    Articles,
    Events,
    Projects,
    Teachers,
    Menu,
    Pages,
    CalendarDays,
    Communications,
    Gallery,
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
