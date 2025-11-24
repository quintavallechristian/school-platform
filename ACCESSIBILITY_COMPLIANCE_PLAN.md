# Piano di Conformità all'European Accessibility Act (EAA)

## Panoramica
Questo documento delinea gli interventi necessari per rendere la piattaforma school-blog conforme all'**European Accessibility Act (EAA)** e alle **WCAG 2.1 Level AA**.

**Data di scadenza EAA**: 28 giugno 2025  
**Standard di riferimento**: WCAG 2.1 Level AA (EN 301 549)

---

## 1. ANALISI DELLE CRITICITÀ ATTUALI

### 1.1 Problemi Critici Identificati

#### **A. Semantica HTML e Struttura**
- ❌ **Lang attribute mancante**: Il layout root ha `lang="en"` invece di `lang="it"`
- ❌ **Landmark regions**: Mancano landmark ARIA appropriati
- ❌ **Heading hierarchy**: Da verificare la gerarchia dei titoli in tutte le pagine
- ❌ **Skip links**: Mancano link per saltare al contenuto principale

#### **B. Accessibilità Tastiera**
- ❌ **Focus visibile**: Non ci sono stili personalizzati per il focus
- ❌ **Trap del focus**: Da verificare nei modali e popup (es. CommunicationsPopup)
- ❌ **Ordine di tabulazione**: Da verificare in tutti i componenti interattivi

#### **C. Contrasto Colori**
- ⚠️ **Colori dinamici**: I colori personalizzati delle scuole potrebbero non rispettare il rapporto 4.5:1
- ❌ **Validazione contrasto**: Nessun sistema di validazione automatica

#### **D. Immagini e Media**
- ❌ **Alt text**: Da verificare su tutte le immagini
- ❌ **Decorative images**: Immagini decorative devono avere `alt=""`
- ❌ **Logo**: Il logo della scuola potrebbe non avere alt text appropriato

#### **E. Form e Input**
- ❌ **Label associati**: Da verificare in tutti i form (login, registrazione, etc.)
- ❌ **Messaggi di errore**: Devono essere annunciati agli screen reader
- ❌ **Required fields**: Devono essere marcati semanticamente

#### **F. Navigazione**
- ❌ **ARIA labels**: Link e bottoni potrebbero non avere label descrittivi
- ❌ **Current page indicator**: Manca indicazione della pagina corrente nella navbar
- ❌ **Breadcrumbs**: Potrebbero mancare in alcune sezioni

#### **G. Contenuto Dinamico**
- ❌ **Live regions**: Notifiche e toast potrebbero non essere annunciati
- ❌ **Loading states**: Stati di caricamento non accessibili
- ❌ **Error messages**: Messaggi di errore potrebbero non essere accessibili

#### **H. Mobile e Responsive**
- ⚠️ **Touch targets**: Dimensione minima 44x44px da verificare
- ⚠️ **Zoom**: Supporto zoom fino a 200% da testare
- ⚠️ **Orientamento**: Supporto sia portrait che landscape

---

## 2. INTERVENTI PRIORITARI (FASE 1 - CRITICA)

### 2.1 Correzioni al Layout Root
**File**: `src/app/(frontend)/layout.tsx`

```tsx
// PRIMA
<html lang="en" suppressHydrationWarning>

// DOPO
<html lang="it" suppressHydrationWarning>
```

**Aggiungere**:
- Meta tag viewport appropriato
- Meta tag per accessibilità
- Preload dei font per evitare FOUT

### 2.2 Skip Links
**File**: `src/app/(frontend)/[school]/layout.tsx`

Aggiungere all'inizio del body:
```tsx
<a href="#main-content" className="skip-link">
  Salta al contenuto principale
</a>
```

Con CSS:
```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### 2.3 Focus Visibile Globale
**File**: `src/app/(frontend)/styles.css`

```css
/* Focus visibile per tutti gli elementi interattivi */
*:focus-visible {
  outline: 3px solid var(--color-primary, #3b82f6);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Rimuovi outline solo se non usando tastiera */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### 2.4 Landmark ARIA
**File**: `src/app/(frontend)/[school]/layout.tsx`

```tsx
// Main content
<main id="main-content" role="main" className="min-h-screen">
  {children}
</main>

// Footer
<footer role="contentinfo" className="bg-gray-100...">
  ...
</footer>
```

### 2.5 Navbar Accessibile
**File**: `src/components/Navbar/Navbar.tsx`

Aggiungere:
- `role="navigation"` e `aria-label="Navigazione principale"`
- `aria-current="page"` per la pagina corrente
- Gestione tastiera per menu mobile
- Focus trap quando menu mobile è aperto

### 2.6 Validazione Contrasto Colori
**File**: `src/lib/accessibility.ts` (nuovo)

```typescript
/**
 * Calcola il rapporto di contrasto tra due colori
 * Deve essere almeno 4.5:1 per testo normale (WCAG AA)
 * Deve essere almeno 3:1 per testo grande (WCAG AA)
 */
export function getContrastRatio(color1: string, color2: string): number {
  // Implementazione calcolo contrasto
}

/**
 * Valida che i colori della scuola rispettino WCAG AA
 */
export function validateSchoolColors(colors: SchoolColors): {
  valid: boolean;
  issues: string[];
} {
  // Validazione automatica
}
```

### 2.7 Componente Form Accessibile
**File**: `src/components/ui/accessible-form.tsx` (nuovo)

```tsx
export function AccessibleInput({
  label,
  error,
  required,
  ...props
}: AccessibleInputProps) {
  const id = useId()
  const errorId = `${id}-error`
  
  return (
    <div>
      <label htmlFor={id}>
        {label}
        {required && <span aria-label="obbligatorio"> *</span>}
      </label>
      <input
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <div id={errorId} role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  )
}
```

---

## 3. INTERVENTI SECONDARI (FASE 2 - IMPORTANTE)

### 3.1 Immagini e Alt Text
**Tutti i componenti con immagini**

Checklist:
- [ ] Logo scuola ha alt text appropriato
- [ ] Immagini decorative hanno `alt=""`
- [ ] Immagini informative hanno alt text descrittivo
- [ ] Icone hanno `aria-label` o sono nascoste con `aria-hidden="true"`

### 3.2 Live Regions per Notifiche
**File**: `src/components/CommunicationsPopup/CommunicationsPopup.tsx`

```tsx
<div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
  <h2 id="dialog-title">Nuove Comunicazioni</h2>
  ...
</div>
```

**File**: Toast notifications (Sonner)
```tsx
<Toaster 
  position="top-right"
  toastOptions={{
    role: 'status',
    'aria-live': 'polite',
  }}
/>
```

### 3.3 Tabelle Accessibili
**File**: `src/components/CalendarView/CalendarView.tsx`

```tsx
<table role="table" aria-label="Calendario eventi">
  <caption className="sr-only">
    Calendario degli eventi scolastici
  </caption>
  <thead>
    <tr>
      <th scope="col">Data</th>
      <th scope="col">Evento</th>
    </tr>
  </thead>
  ...
</table>
```

### 3.4 Breadcrumbs
**File**: `src/components/Breadcrumbs/Breadcrumbs.tsx` (nuovo)

```tsx
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb">
        {items.map((item, index) => (
          <li key={index}>
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

### 3.5 Loading States
**File**: `src/components/ui/loading.tsx` (nuovo)

```tsx
export function LoadingSpinner({ label = "Caricamento in corso" }) {
  return (
    <div role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  )
}
```

---

## 4. INTERVENTI MIGLIORATIVI (FASE 3 - OPZIONALE)

### 4.1 Modalità Alto Contrasto
**File**: `src/app/(frontend)/styles.css`

```css
@media (prefers-contrast: high) {
  :root {
    --color-primary: #000;
    --color-secondary: #000;
    --color-background: #fff;
  }
  
  .dark {
    --color-primary: #fff;
    --color-secondary: #fff;
    --color-background: #000;
  }
}
```

### 4.2 Riduzione Movimento
**File**: `src/app/(frontend)/styles.css`

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4.3 Dimensione Testo Personalizzabile
Supportare zoom fino a 200% senza perdita di funzionalità

### 4.4 Tooltips Accessibili
**File**: `src/components/ui/tooltip.tsx`

```tsx
export function AccessibleTooltip({ content, children }) {
  return (
    <div>
      <button
        aria-describedby="tooltip"
        onMouseEnter={show}
        onFocus={show}
      >
        {children}
      </button>
      <div id="tooltip" role="tooltip" aria-hidden={!visible}>
        {content}
      </div>
    </div>
  )
}
```

---

## 5. TESTING E VALIDAZIONE

### 5.1 Tool Automatici
- [ ] **axe DevTools**: Scansione automatica WCAG
- [ ] **WAVE**: Valutazione accessibilità
- [ ] **Lighthouse**: Audit accessibilità
- [ ] **Pa11y**: Test automatizzati CI/CD

### 5.2 Test Manuali
- [ ] **Navigazione tastiera**: Tab, Shift+Tab, Enter, Esc, Arrow keys
- [ ] **Screen reader**: NVDA (Windows), VoiceOver (Mac), JAWS
- [ ] **Zoom**: Test a 200%, 400%
- [ ] **Contrasto**: Verifica manuale con Color Contrast Analyzer

### 5.3 Test Utenti
- [ ] Test con utenti con disabilità visive
- [ ] Test con utenti con disabilità motorie
- [ ] Test con utenti con disabilità cognitive

---

## 6. DOCUMENTAZIONE E DICHIARAZIONE

### 6.1 Dichiarazione di Accessibilità
**File**: `src/app/(frontend)/[school]/accessibilita/page.tsx` (nuovo)

Creare pagina con:
- Livello di conformità (WCAG 2.1 AA)
- Data ultima verifica
- Limitazioni note
- Feedback e contatti
- Procedura di reclamo

### 6.2 Documentazione per Editori
Creare guida per:
- Come scrivere alt text efficaci
- Come scegliere colori accessibili
- Come strutturare contenuti
- Come creare documenti accessibili (PDF)

---

## 7. TIMELINE IMPLEMENTAZIONE

### Settimana 1-2: Fase 1 (Critica)
- Correzioni layout e lang
- Skip links
- Focus visibile
- Landmark ARIA
- Validazione contrasto base

### Settimana 3-4: Fase 2 (Importante)
- Form accessibili
- Immagini e alt text
- Live regions
- Tabelle
- Breadcrumbs

### Settimana 5-6: Fase 3 (Migliorativa)
- Alto contrasto
- Riduzione movimento
- Tooltips
- Testing completo

### Settimana 7: Testing e Validazione
- Test automatici
- Test manuali
- Correzioni finali

### Settimana 8: Documentazione
- Dichiarazione accessibilità
- Guide per editori
- Report finale

---

## 8. CHECKLIST WCAG 2.1 AA

### Perceivable (Percepibile)
- [ ] 1.1.1 - Contenuto non testuale (alt text)
- [ ] 1.2.1 - Solo audio e solo video (preregistrati)
- [ ] 1.2.2 - Sottotitoli (preregistrati)
- [ ] 1.2.3 - Audiodescrizione o media alternativo
- [ ] 1.3.1 - Info e relazioni
- [ ] 1.3.2 - Sequenza significativa
- [ ] 1.3.3 - Caratteristiche sensoriali
- [ ] 1.3.4 - Orientamento
- [ ] 1.3.5 - Identificare lo scopo dell'input
- [ ] 1.4.1 - Uso del colore
- [ ] 1.4.2 - Controllo audio
- [ ] 1.4.3 - Contrasto (minimo) 4.5:1
- [ ] 1.4.4 - Ridimensionamento testo (200%)
- [ ] 1.4.5 - Immagini di testo
- [ ] 1.4.10 - Reflow
- [ ] 1.4.11 - Contrasto non testuale (3:1)
- [ ] 1.4.12 - Spaziatura del testo
- [ ] 1.4.13 - Contenuto al passaggio del mouse o focus

### Operable (Utilizzabile)
- [ ] 2.1.1 - Tastiera
- [ ] 2.1.2 - Nessun blocco tastiera
- [ ] 2.1.4 - Scorciatoie da tastiera
- [ ] 2.2.1 - Regolazione tempi
- [ ] 2.2.2 - Pausa, stop, nascondi
- [ ] 2.3.1 - Tre flash o sotto soglia
- [ ] 2.4.1 - Salto blocchi (skip links)
- [ ] 2.4.2 - Titolo pagina
- [ ] 2.4.3 - Ordine focus
- [ ] 2.4.4 - Scopo del link (nel contesto)
- [ ] 2.4.5 - Molteplici vie
- [ ] 2.4.6 - Intestazioni ed etichette
- [ ] 2.4.7 - Focus visibile
- [ ] 2.5.1 - Gesti del puntatore
- [ ] 2.5.2 - Cancellazione puntatore
- [ ] 2.5.3 - Etichetta nel nome
- [ ] 2.5.4 - Attivazione movimento

### Understandable (Comprensibile)
- [ ] 3.1.1 - Lingua della pagina
- [ ] 3.1.2 - Lingua delle parti
- [ ] 3.2.1 - Al focus
- [ ] 3.2.2 - All'input
- [ ] 3.2.3 - Navigazione coerente
- [ ] 3.2.4 - Identificazione coerente
- [ ] 3.3.1 - Identificazione errori
- [ ] 3.3.2 - Etichette o istruzioni
- [ ] 3.3.3 - Suggerimento errori
- [ ] 3.3.4 - Prevenzione errori (legale, finanziario, dati)

### Robust (Robusto)
- [ ] 4.1.1 - Parsing
- [ ] 4.1.2 - Nome, ruolo, valore
- [ ] 4.1.3 - Messaggi di stato

---

## 9. RISORSE E RIFERIMENTI

### Normative
- [European Accessibility Act (EAA)](https://ec.europa.eu/social/main.jsp?catId=1202)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [EN 301 549](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf)
- [AGID - Linee guida accessibilità](https://www.agid.gov.it/it/design-servizi/accessibilita)

### Tool
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [Pa11y](https://pa11y.org/)

### Guide
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

## 10. COSTI E RISORSE

### Risorse Necessarie
- **Sviluppatore Frontend**: 6-8 settimane full-time
- **UX Designer**: 2 settimane (revisione design)
- **Tester Accessibilità**: 1-2 settimane
- **Consulente Accessibilità**: Opzionale, ma consigliato

### Costi Stimati
- **Tool**: €500-1000 (licenze axe Pro, JAWS, etc.)
- **Testing utenti**: €1000-2000
- **Consulenza**: €2000-5000 (opzionale)
- **Totale**: €3500-8000

---

## CONCLUSIONI

La conformità all'EAA richiede un approccio sistematico e continuo. Gli interventi proposti sono divisi in tre fasi prioritarie, con una timeline di 8 settimane per l'implementazione completa.

**Prossimi passi immediati**:
1. Implementare le correzioni critiche (Fase 1)
2. Configurare tool di testing automatico
3. Formare il team sui principi di accessibilità
4. Stabilire processo di review continuo

**Benefici attesi**:
- ✅ Conformità legale EAA
- ✅ Migliore UX per tutti gli utenti
- ✅ SEO migliorato
- ✅ Maggiore reach di mercato
- ✅ Riduzione rischi legali
