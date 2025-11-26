# Aggiornamenti Cookie Banner - Minimizzazione

## Modifiche Implementate

### ✨ Nuove Funzionalità

1. **Banner Minimizzabile**
   - Pulsante minimizza (freccia giù) nella vista principale
   - Pulsante minimizza anche nella vista impostazioni dettagliate
   - Quando minimizzato, mostra un badge floating nell'angolo in basso a destra
   - Click sul badge per espandere di nuovo il banner

2. **Overlay Condizionale**
   - L'overlay scuro con blur **NON viene mostrato** nella pagina `/cookie-policy`
   - Nelle altre pagine l'overlay rimane attivo per forzare la scelta dell'utente

### 🎨 Design del Badge Minimizzato

Il badge minimizzato ha:
- Icona cookie 🍪
- Testo "Cookie Settings"
- Design floating in basso a destra
- Shadow importante per visibilità
- Effetto hover con scale
- Supporto dark mode completo

### 📍 Posizionamento

- **Banner normale**: Bottom center, full width responsive
- **Banner minimizzato**: Fixed bottom-right (bottom-6 right-6)

### 🔧 Implementazione Tecnica

```typescript
// Stato aggiunto
const [isMinimized, setIsMinimized] = useState(false)

// Rilevamento pagina
const pathname = usePathname()
const isOnCookiePolicyPage = pathname === '/cookie-policy'

// Overlay condizionale
{!isOnCookiePolicyPage && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" />
)}
```

### 🎯 Comportamento Utente

**Scenario 1: Prima visita**
1. Banner appare con overlay (eccetto su /cookie-policy)
2. Utente può:
   - Accettare tutti i cookie
   - Rifiutare cookie non necessari
   - Personalizzare preferenze
   - **Minimizzare il banner** (nuovo!)

**Scenario 2: Banner minimizzato**
1. Badge floating visibile in basso a destra
2. Click sul badge → Banner si espande
3. L'overlay **non riappare** quando si espande da minimizzato

**Scenario 3: Pagina Cookie Policy**
1. Banner appare normalmente
2. **Nessun overlay** per non bloccare la lettura
3. Minimizzazione funziona normalmente

### 📱 Responsività

- Desktop: Badge con icona + testo
- Mobile: Badge responsive con dimensioni appropriate
- Il banner principale rimane completamente responsive

### ♿ Accessibilità

- ARIA labels su tutti i pulsanti
- `aria-label="Minimizza banner"` sul pulsante minimizza
- `aria-label="Espandi banner cookie"` sul badge
- Navigazione da tastiera supportata

### 🎨 Stili Usati

**Badge Minimizzato:**
```tsx
className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-neutral-900 
rounded-full shadow-2xl border border-neutral-200 dark:border-neutral-700 
hover:scale-105 transition-transform duration-200"
```

**Pulsante Minimizza:**
```tsx
className="text-neutral-500 hover:text-neutral-700 
dark:hover:text-neutral-300 p-2"
```

### 🔄 Stati del Banner

1. **Nascosto** (`showBanner = false`)
   - Consenso già dato
   - Return null

2. **Minimizzato** (`isMinimized = true`)
   - Mostra solo badge floating
   - Click espande il banner

3. **Espanso - Vista Semplice** (`showSettings = false`)
   - Banner completo con 3 pulsanti
   - Pulsante minimizza in alto a destra

4. **Espanso - Vista Impostazioni** (`showSettings = true`)
   - Impostazioni dettagliate
   - Due pulsanti in alto: minimizza + chiudi

### 🐛 Testing

**Test da eseguire:**

1. ✅ Prima visita → Banner appare con overlay
2. ✅ Click minimizza → Badge appare in basso a destra
3. ✅ Click badge → Banner si espande
4. ✅ Navigazione a /cookie-policy → Nessun overlay
5. ✅ Dark mode → Tutti gli stati funzionano
6. ✅ Mobile → Responsive corretto
7. ✅ Accetta/Rifiuta → Banner scompare e preferenze salvate

### 💡 Suggerimenti Futuri

Possibili miglioramenti:
- Animazione smooth expand/minimize
- Persistenza dello stato minimizzato in sessionStorage
- Badge personalizzabile (colore, posizione)
- Animazione pulsante quando banner è minimizzato

### 📝 Note Tecniche

- Usa `usePathname()` da `next/navigation` per rilevare la route
- Non richiede props aggiuntive
- Completamente self-contained
- Nessuna dipendenza esterna oltre a Next.js e il componente Button

## File Modificati

- ✅ `/src/components/CookieBanner/CookieBanner.tsx`

## Compatibilità

- ✅ Next.js 15.x
- ✅ React 18+
- ✅ Dark mode support
- ✅ Mobile & Desktop
- ✅ Tutti i browser moderni
