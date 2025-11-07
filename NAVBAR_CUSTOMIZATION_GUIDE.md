# Guida alla Personalizzazione della Navbar

## 📋 Come funziona la navbar dinamica

La navbar ora è **semi-dinamica**:

- Menu items **statici**: Blog, Chi siamo, Eventi, Mensa (hard-coded)
- Menu items **dinamici**: Tutte le pagine con `showInNavbar = true` vengono aggiunte automaticamente

## 🎨 Personalizzare i menu items statici

Modifica il file `/src/components/Navbar/Navbar.tsx`:

```tsx
const menuItems = [
  { label: 'Blog', href: '/blog' },
  { label: 'Chi siamo', href: '/chi-siamo' },
  { label: 'Eventi', href: '/eventi' },
  { label: 'Mensa', href: '/mensa' },
  // Aggiungi qui altri link statici
  { label: 'Contatti', href: '/contatti' },
  // Le pagine dal CMS verranno aggiunte automaticamente dopo
  ...navbarPages.map((page) => ({
    label: page.title,
    href: `/pagine/${page.slug}`,
  })),
]
```

## 🔧 Aggiungere pagine dinamiche alla navbar

1. Vai su `/admin/collections/pages`
2. Crea o modifica una pagina
3. Attiva **"Mostra nella navbar"** ✓
4. Imposta un **"Ordine nella navbar"** (numero: più basso = prima)
5. Salva

La pagina apparirà automaticamente nel menu!

## 📱 Menu mobile e desktop

Entrambi i menu (mobile hamburger e desktop) usano gli stessi `menuItems`, quindi le modifiche si applicano automaticamente a entrambi.

## 🎯 Ordinare i menu items

L'ordine finale è:

1. Prima tutti i menu items statici (nell'ordine in cui sono definiti)
2. Poi le pagine dal CMS (ordinate per `navbarOrder`)

### Opzione A: Solo pagine dinamiche

Se vuoi gestire TUTTO dal CMS, rimuovi i menu items statici:

```tsx
const menuItems = [
  // Nessun menu statico
  ...navbarPages.map((page) => ({
    label: page.title,
    href: `/pagine/${page.slug}`,
  })),
]
```

Poi crea le pagine nel CMS:

- Blog (slug: `blog`, navbarOrder: 1)
- Chi Siamo (slug: `chi-siamo`, navbarOrder: 2)
- Eventi (slug: `eventi`, navbarOrder: 3)
- Mensa (slug: `mensa`, navbarOrder: 4)

### Opzione B: Mix personalizzato

Puoi inserire le pagine dinamiche in mezzo a quelle statiche:

```tsx
const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  // Inserisci le pagine del CMS qui
  ...navbarPages.map((page) => ({
    label: page.title,
    href: `/pagine/${page.slug}`,
  })),
  // Poi altri link statici
  { label: 'Contatti', href: '/contatti' },
]
```

## 🚀 Esempio completo

### Scenario: Vuoi aggiungere "Storia della Scuola" alla navbar

1. **Crea la pagina nel CMS**:
   - Titolo: `Storia della Scuola`
   - Slug: `storia`
   - Contenuto: [scrivi la storia]
   - ✓ Mostra nella navbar: `true`
   - Ordine nella navbar: `3`
   - Salva

2. **Risultato automatico**:
   - Navbar desktop: `Blog | Chi siamo | Storia della Scuola | Eventi | Mensa`
   - Navbar mobile: stessa cosa nel menu hamburger
   - URL: `/pagine/storia`

## 💡 Suggerimenti

### Icone nei menu (opzionale)

Per aggiungere icone, modifica il tipo `MenuItem`:

```tsx
type MenuItem = {
  label: string
  href: string
  icon?: React.ReactNode // Aggiungi questo
}
```

E poi usa le icone di Lucide React:

```tsx
import { Home, Users, Calendar, Utensils } from 'lucide-react'

const menuItems = [
  { label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
  { label: 'Chi siamo', href: '/chi-siamo', icon: <Users className="w-4 h-4" /> },
  // ...
]
```

### Dropdown menu (future)

Per creare menu dropdown (es: "Chi siamo" con sotto-voci), puoi estendere il sistema con:

```tsx
type MenuItem = {
  label: string
  href: string
  children?: MenuItem[] // Per sub-menu
}
```

## ❓ Risoluzione problemi

### La pagina non appare nella navbar

✓ Controlla che `showInNavbar` sia `true`
✓ Ricarica la pagina (la navbar è cached)
✓ Controlla i log del server per errori

### L'ordine è sbagliato

✓ Verifica i valori di `navbarOrder` (più basso = prima)
✓ I menu statici vengono sempre prima delle pagine dinamiche

### La pagina esiste ma dà 404

✓ Verifica che lo slug sia corretto
✓ L'URL deve essere `/pagine/[slug]` non solo `/[slug]`
✓ Riavvia il server dev: `npm run dev`
