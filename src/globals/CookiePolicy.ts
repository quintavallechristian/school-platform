import { GlobalConfig } from 'payload'
import { getSchoolField, publicRead, tenantUpdate } from '../lib/access'

export const CookiePolicy: GlobalConfig = {
  slug: 'CookiePolicy',
  label: 'Cookie Policy',
  admin: {
    group: 'Struttura Sito',
    description: 'Configura i contenuti della pagina Cookie Policy',
  },
  access: {
    read: publicRead,
    update: tenantUpdate,
  },
  fields: [
    getSchoolField('Scuola a cui appartiene questa configurazione'),
    {
      name: 'customizeCookiePolicy',
      type: 'checkbox',
      label: 'Personalizza Cookie Policy',
      defaultValue: false,
      admin: {
        description:
          'Se disabilitato, verrà mostrata la pagina di default "Cookie Policy". Se abilitato, puoi personalizzare in contenuto. Suggeriamo di abilitare questa opzione e personalizzare la Cookie Policy con i dati della tua scuola.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenuto principale',
      admin: {
        description: 'Testo principale',
        condition: (data) => data.customizeCookiePolicy === true,
      },
    },
  ],
}
