import { GlobalConfig } from 'payload'
import { getSchoolField, publicRead, tenantUpdate } from '../lib/access'

export const PrivacyPolicy: GlobalConfig = {
  slug: 'PrivacyPolicy',
  label: 'Privacy Policy',
  admin: {
    group: 'Struttura Sito',
    description: 'Configura i contenuti della pagina Privacy Policy',
  },
  access: {
    read: publicRead,
    update: tenantUpdate,
  },
  fields: [
    getSchoolField('Scuola a cui appartiene questa configurazione'),
    {
      name: 'customizePrivacyPolicy',
      type: 'checkbox',
      label: 'Personalizza Privacy Policy',
      defaultValue: false,
      admin: {
        description:
          'Se disabilitato, verrà mostrata la pagina di default "Privacy Policy". Se abilitato, puoi personalizzare in contenuto. Suggeriamo di abilitare questa opzione e personalizzare la Privacy Policy con i dati della tua scuola.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenuto principale',
      admin: {
        description: 'Testo principale',
        condition: (data) => data.customizePrivacyPolicy === true,
      },
    },
  ],
}
