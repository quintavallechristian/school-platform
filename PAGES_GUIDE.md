# Guida alle Pagine (Pages Collection)

## Cos'è una Page?

Le **Pages** sono pagine statiche del sito, diverse dagli **Articles** (articoli del blog).

- **Articles**: contenuti del blog con date di pubblicazione, autori, pensati per essere aggiornati frequentemente
- **Pages**: contenuti statici come "Chi Siamo", "Contatti", "Storia della Scuola", ecc.

## Come creare una nuova pagina

1. Vai al pannello di amministrazione PayloadCMS (`/admin`)
2. Nel menu laterale, clicca su **Pages**
3. Clicca su **Create New**
4. Compila i campi:
   - **Titolo**: Il titolo della pagina (es. "Chi Siamo")
   - **URL (slug)**: L'URL della pagina (es. "chi-siamo")
   - **Sottotitolo**: Testo opzionale che appare sotto il titolo
   - **Immagine di copertina**: Immagine opzionale (attualmente non visualizzata, ma preparata per future implementazioni)
   - **Contenuto**: Il contenuto ricco della pagina (puoi formattare testo, inserire immagini, link, ecc.)
   - **Mostra nella navbar**: Se attivato, la pagina apparirà automaticamente nel menu di navigazione
   - **Ordine nella navbar**: Numero per controllare l'ordine nel menu (più basso = prima)
   - **SEO**: Campi opzionali per ottimizzare la pagina nei motori di ricerca

5. Clicca su **Save**

## Come visualizzare le pagine

Le pagine sono accessibili tramite:

- URL specifico: `/pagine/[slug]` (es. `/pagine/chi-siamo`)
- Lista di tutte le pagine: `/pagine`

## Esempio: Convertire "Chi Siamo" in una Page

### Opzione 1: Creare una nuova Page

1. Crea una nuova Page con:
   - Titolo: "Chi Siamo"
   - Slug: "chi-siamo"
   - Contenuto: Copia il contenuto dalla pagina esistente
2. La pagina sarà disponibile su `/pagine/chi-siamo`

### Opzione 2: Mantenere la rotta personalizzata

Se preferisci mantenere `/chi-siamo` invece di `/pagine/chi-siamo`, puoi:

1. Creare la Page nel CMS
2. Modificare `/src/app/(frontend)/chi-siamo/page.tsx` per caricare i dati dalla collection Pages

Esempio:

```tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page as PageType } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

export default async function ChiSiamoPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const pageData = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'chi-siamo',
      },
    },
    limit: 1,
  })

  const page = pageData.docs[0] as PageType | undefined

  // ... usa page.content con <RichText data={page.content} />
}
```

## Vantaggi del sistema Pages

✅ **Gestione centralizzata**: Tutte le pagine statiche in un unico posto
✅ **Editing visuale**: Editor rich text per formattare contenuti senza codice
✅ **SEO integrato**: Campi meta title e description per ogni pagina
✅ **Navbar automatica**: Le pagine possono apparire automaticamente nel menu
✅ **Flessibilità**: Puoi aggiungere nuove pagine senza toccare il codice

## Campi disponibili

| Campo               | Tipo      | Descrizione                              |
| ------------------- | --------- | ---------------------------------------- |
| title               | Testo     | Titolo della pagina (obbligatorio)       |
| slug                | Testo     | URL della pagina (obbligatorio, unico)   |
| subtitle            | Testo     | Sottotitolo opzionale                    |
| cover               | Media     | Immagine di copertina opzionale          |
| content             | Rich Text | Contenuto principale (obbligatorio)      |
| showInNavbar        | Checkbox  | Se mostrare nel menu di navigazione      |
| navbarOrder         | Numero    | Ordine nel menu (se showInNavbar è true) |
| seo.metaTitle       | Testo     | Titolo SEO personalizzato                |
| seo.metaDescription | Textarea  | Descrizione SEO (max 160 caratteri)      |

## Prossimi passi

Ora che hai il sistema Pages, puoi:

1. Creare una pagina "Chi Siamo" nel CMS
2. Creare altre pagine come "Contatti", "Storia", "Privacy Policy", ecc.
3. Attivare "Mostra nella navbar" per le pagine principali
4. Personalizzare la navbar per mostrare automaticamente queste pagine

## Note tecniche

- Le pagine sono generate staticamente (SSG) per migliori performance
- I tipi TypeScript sono generati automaticamente da PayloadCMS
- Il contenuto usa Lexical editor come gli Articles e gli Events
- I metadati SEO sono generati automaticamente per ogni pagina
