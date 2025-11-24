# Guida all'Accessibilità - WCAG 2.1 AA

Questa guida fornisce informazioni su come mantenere la conformità all'**European Accessibility Act (EAA)** e alle **WCAG 2.1 Level AA** nella piattaforma.

## 📋 Indice

1. [Componenti Accessibili](#componenti-accessibili)
2. [Validazione Colori](#validazione-colori)
3. [Best Practices](#best-practices)
4. [Testing](#testing)
5. [Risorse](#risorse)

---

## 🧩 Componenti Accessibili

### Form Accessibili

Usa i componenti in `src/components/ui/accessible-form.tsx`:

```tsx
import { AccessibleInput, AccessibleTextarea, AccessibleSelect, AccessibleCheckbox } from '@/components/ui/accessible-form'

// Input con label e gestione errori
<AccessibleInput
  label="Email"
  type="email"
  required
  error={errors.email}
  helperText="Inserisci un'email valida"
/>

// Textarea
<AccessibleTextarea
  label="Messaggio"
  required
  error={errors.message}
/>

// Select
<AccessibleSelect
  label="Categoria"
  options={[
    { value: 'news', label: 'Notizie' },
    { value: 'events', label: 'Eventi' }
  ]}
/>

// Checkbox
<AccessibleCheckbox
  label="Accetto i termini e condizioni"
  required
/>
```

**Caratteristiche:**
- ✅ Label associati correttamente con `htmlFor`
- ✅ Errori annunciati con `role="alert"` e `aria-live="polite"`
- ✅ Required fields marcati con `aria-required`
- ✅ Helper text collegati con `aria-describedby`

### Loading States

Usa i componenti in `src/components/ui/loading.tsx`:

```tsx
import { LoadingSpinner, Skeleton, LoadingOverlay, ProgressBar } from '@/components/ui/loading'

// Spinner
<LoadingSpinner 
  label="Caricamento dati..." 
  size="lg"
  showLabel={true}
/>

// Skeleton
<Skeleton className="h-20 w-full" label="Caricamento articolo" />

// Overlay
<LoadingOverlay 
  visible={isLoading}
  message="Salvataggio in corso..."
/>

// Progress bar
<ProgressBar 
  value={uploadProgress}
  label="Upload file"
  showPercentage
/>
```

**Caratteristiche:**
- ✅ `role="status"` per annunci agli screen reader
- ✅ `aria-live="polite"` per aggiornamenti non invasivi
- ✅ Testo nascosto visivamente ma accessibile con `.sr-only`

---

## 🎨 Validazione Colori

### Libreria di Validazione

Usa le funzioni in `src/lib/accessibility.ts`:

```tsx
import { 
  getContrastRatio, 
  validateSchoolColors,
  suggestAccessibleColor,
  formatValidationReport 
} from '@/lib/accessibility'

// Calcola contrasto tra due colori
const ratio = getContrastRatio('#3b82f6', '#ffffff')
console.log(`Contrasto: ${ratio}:1`) // Deve essere >= 4.5:1

// Valida i colori di una scuola
const validation = validateSchoolColors({
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  lightTheme: {
    textPrimary: '#1e293b',
    backgroundPrimary: '#ffffff'
  }
})

if (!validation.valid) {
  console.log(formatValidationReport(validation))
}

// Suggerisci colore accessibile
const accessibleColor = suggestAccessibleColor('#ffeb3b', '#ffffff', 4.5)
```

### Test Automatico

Esegui il test su tutte le scuole:

```bash
pnpm test:accessibility
```

Questo script:
- ✅ Controlla tutti i colori nel database
- ✅ Verifica conformità WCAG AA (4.5:1)
- ✅ Genera report dettagliato
- ✅ Esce con codice errore se ci sono problemi

---

## ✨ Best Practices

### 1. Semantica HTML

**✅ Corretto:**
```tsx
<nav role="navigation" aria-label="Navigazione principale">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/blog">Blog</a></li>
  </ul>
</nav>

<main id="main-content" role="main">
  <h1>Titolo Pagina</h1>
  <article>...</article>
</main>

<footer role="contentinfo">
  <p>© 2025 Scuola</p>
</footer>
```

**❌ Evitare:**
```tsx
<div class="nav">...</div>
<div class="main">...</div>
<div class="footer">...</div>
```

### 2. Immagini e Alt Text

**✅ Corretto:**
```tsx
// Immagine informativa
<Image 
  src="/logo.png" 
  alt="Logo Scuola Primaria Rossi" 
/>

// Immagine decorativa
<Image 
  src="/decoration.png" 
  alt="" 
  aria-hidden="true"
/>

// Icona con testo
<button>
  <TrashIcon aria-hidden="true" />
  <span>Elimina</span>
</button>

// Icona senza testo
<button aria-label="Elimina articolo">
  <TrashIcon aria-hidden="true" />
</button>
```

### 3. Focus Visibile

Il focus è già gestito globalmente in `styles.css`:

```css
*:focus-visible {
  outline: 3px solid hsl(var(--primary));
  outline-offset: 2px;
  border-radius: 4px;
}
```

**Non rimuovere mai l'outline!** Se necessario, personalizzalo ma mantienilo visibile.

### 4. Skip Links

Ogni pagina ha già uno skip link:

```tsx
<a href="#main-content" className="skip-link">
  Salta al contenuto principale
</a>
```

Assicurati che il `main` abbia l'id corretto:

```tsx
<main id="main-content" role="main">
  {children}
</main>
```

### 5. Heading Hierarchy

**✅ Corretto:**
```tsx
<h1>Titolo Principale</h1>
  <h2>Sezione 1</h2>
    <h3>Sottosezione 1.1</h3>
  <h2>Sezione 2</h2>
    <h3>Sottosezione 2.1</h3>
```

**❌ Evitare:**
```tsx
<h1>Titolo</h1>
<h3>Saltato h2!</h3>
<h2>Ordine sbagliato</h2>
```

### 6. Link Descrittivi

**✅ Corretto:**
```tsx
<Link href="/blog/articolo-1">
  Leggi l'articolo completo su "Accessibilità Web"
</Link>

<Link href="/eventi/festa-primavera" aria-label="Dettagli evento Festa di Primavera">
  Scopri di più
</Link>
```

**❌ Evitare:**
```tsx
<Link href="/blog/articolo-1">Clicca qui</Link>
<Link href="/eventi/1">Leggi</Link>
```

### 7. Tabelle Accessibili

```tsx
<table role="table" aria-label="Calendario eventi">
  <caption className="sr-only">
    Calendario degli eventi scolastici di Marzo 2025
  </caption>
  <thead>
    <tr>
      <th scope="col">Data</th>
      <th scope="col">Evento</th>
      <th scope="col">Luogo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>15 Marzo</td>
      <td>Festa di Primavera</td>
      <td>Aula Magna</td>
    </tr>
  </tbody>
</table>
```

### 8. Modali e Dialog

```tsx
<Dialog>
  <DialogContent 
    role="dialog" 
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    aria-modal="true"
  >
    <DialogTitle id="dialog-title">
      Conferma eliminazione
    </DialogTitle>
    <DialogDescription id="dialog-description">
      Sei sicuro di voler eliminare questo elemento?
    </DialogDescription>
    <DialogFooter>
      <Button onClick={onCancel}>Annulla</Button>
      <Button onClick={onConfirm}>Conferma</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 🧪 Testing

### 1. Test Automatici

#### Lighthouse (Chrome DevTools)
```bash
# Apri Chrome DevTools > Lighthouse
# Seleziona "Accessibility"
# Genera report
```

#### axe DevTools
```bash
# Installa estensione Chrome/Firefox
# Apri DevTools > axe DevTools
# Scan All of My Page
```

#### Pa11y (CI/CD)
```bash
npm install -g pa11y
pa11y http://localhost:3000
```

### 2. Test Manuali

#### Navigazione Tastiera
- [ ] Tab: naviga tra elementi interattivi
- [ ] Shift+Tab: naviga indietro
- [ ] Enter: attiva link/bottoni
- [ ] Spazio: attiva bottoni/checkbox
- [ ] Esc: chiude modali
- [ ] Arrow keys: naviga in menu/select

#### Screen Reader
**VoiceOver (Mac):**
```bash
# Attiva: Cmd + F5
# Naviga: Control + Option + Arrow keys
# Leggi tutto: Control + Option + A
```

**NVDA (Windows):**
```bash
# Scarica da: https://www.nvaccess.org/
# Attiva: Control + Alt + N
# Naviga: Arrow keys
# Leggi tutto: NVDA + Down Arrow
```

#### Zoom
- [ ] Zoom 200%: Cmd/Ctrl + "+"
- [ ] Verifica che tutto sia leggibile
- [ ] Verifica che non ci sia scroll orizzontale
- [ ] Verifica che i bottoni siano cliccabili

### 3. Checklist Rapida

Prima di ogni deploy, verifica:

- [ ] Tutte le immagini hanno alt text appropriato
- [ ] Tutti i form hanno label associati
- [ ] I colori rispettano contrasto 4.5:1
- [ ] Skip link funziona
- [ ] Navigazione tastiera funziona
- [ ] Focus visibile su tutti gli elementi
- [ ] Heading hierarchy corretta (h1 > h2 > h3)
- [ ] Link hanno testo descrittivo
- [ ] Modali hanno focus trap
- [ ] Errori sono annunciati
- [ ] Loading states sono accessibili

---

## 📚 Risorse

### Normative
- [European Accessibility Act](https://ec.europa.eu/social/main.jsp?catId=1202)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [AGID - Accessibilità](https://www.agid.gov.it/it/design-servizi/accessibilita)

### Tool
- [axe DevTools](https://www.deque.com/axe/devtools/) - Estensione browser
- [WAVE](https://wave.webaim.org/) - Valutazione accessibilità
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)
- [NVDA Screen Reader](https://www.nvaccess.org/) - Gratis per Windows

### Guide
- [WebAIM](https://webaim.org/) - Guide e tutorial
- [A11y Project](https://www.a11yproject.com/) - Checklist e pattern
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Inclusive Components](https://inclusive-components.design/)

### Corsi
- [Web Accessibility by Google](https://www.udacity.com/course/web-accessibility--ud891) - Gratis
- [Digital Accessibility Foundations](https://www.w3.org/WAI/fundamentals/foundations-course/) - W3C

---

## 🆘 Supporto

Per domande o problemi relativi all'accessibilità:

1. Consulta il [Piano di Conformità](./ACCESSIBILITY_COMPLIANCE_PLAN.md)
2. Esegui `pnpm test:accessibility` per verificare i colori
3. Usa gli strumenti di testing automatico (axe, WAVE)
4. Testa manualmente con tastiera e screen reader

**Ricorda:** L'accessibilità è un processo continuo, non un obiettivo finale! 🎯
