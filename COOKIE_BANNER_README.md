# Cookie Banner GDPR Compliant

## Descrizione

Sistema completo di gestione cookie GDPR compliant implementato nella piattaforma School Platform.

## Funzionalità

✅ **Banner Cookie Premium** - Design moderno con animazioni e dark mode  
✅ **Gestione Consenso** - Cookie tecnici sempre attivi, cookie analitici opt-in  
✅ **Google Analytics Condizionale** - Caricamento solo dopo consenso esplicito  
✅ **Preferenze Salvate** - LocalStorage per memorizzare le scelte dell'utente  
✅ **Revoca Consenso** - Possibilità di revocare il consenso in qualsiasi momento  
✅ **Overlay Bloccante** - L'utente deve fare una scelta prima di continuare  

## Componenti Creati

### 1. CookieBanner (`/src/components/CookieBanner/CookieBanner.tsx`)
Componente principale che gestisce:
- Visualizzazione del banner
- Gestione delle preferenze
- Integrazione con Google Analytics
- Salvataggio delle scelte in localStorage

### 2. RevokeCookieConsent (`/src/components/CookieBanner/RevokeCookieConsent.tsx`)
Pulsante per revocare il consenso cookie

### 3. useCookieConsent Hook (`/src/hooks/useCookieConsent.ts`)
Hook personalizzato per accedere allo stato del consenso in tutta l'applicazione

## Configurazione Google Analytics (Opzionale)

Per abilitare Google Analytics:

1. Crea un file `.env.local` nella root del progetto (se non esiste già)
2. Aggiungi la tua Measurement ID:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. Lo script di Google Analytics verrà caricato **solo se**:
   - L'utente ha accettato i cookie analitici
   - La variabile d'ambiente è configurata

### Trovare il tuo Google Analytics Measurement ID

1. Vai su [Google Analytics](https://analytics.google.com/)
2. Crea una proprietà GA4 (se non ne hai già una)
3. Vai su **Admin** > **Data Streams** > Seleziona il tuo stream web
4. Troverai il **Measurement ID** (formato: G-XXXXXXXXXX)

## Come Funziona

### Flusso Utente

1. **Prima visita**: Banner mostrato con overlay
2. **Scelta utente**:
   - **Accetta tutti**: Cookie tecnici + analytics attivi
   - **Solo necessari**: Solo cookie tecnici attivi
   - **Personalizza**: Scelta granulare delle categorie
3. **Preferenze salvate**: In `localStorage` come `cookie-consent`
4. **Visite successive**: Banner nascosto, preferenze applicate automaticamente

### Struttura Dati

```typescript
{
  necessary: true,  // Sempre true, non modificabile
  analytics: boolean // Scelta dell'utente
}
```

## Cookie Utilizzati

### Cookie Tecnici (Sempre Attivi)
- `next-auth.session-token` - Autenticazione utente
- `next-auth.csrf-token` - Protezione CSRF
- `payload-token` - Sessione admin Payload CMS
- `__vercel_live_token` - Vercel edge
- `__vercel_fingerprint` - Vercel routing

### Cookie Analitici (Opt-in)
- `_ga` - Google Analytics client ID
- `_ga_*` - Google Analytics session
- `_gid` - Google Analytics 24h identifier

## Personalizzazione

### Modificare i Colori

Il banner usa i colori di Tailwind CSS. Puoi personalizzarli in:
- `src/components/CookieBanner/CookieBanner.tsx`

### Aggiungere Nuove Categorie

1. Aggiorna il tipo `CookiePreferences`:
```typescript
type CookiePreferences = {
  necessary: boolean
  analytics: boolean
  marketing: boolean  // Nuova categoria
}
```

2. Aggiungi la sezione nel render del banner
3. Implementa la logica di inizializzazione in `initializeCookies()`

## Revoca Consenso

Gli utenti possono revocare il consenso:
1. Visitando `/cookie-policy`
2. Scrollando fino alla sezione "Revoca Consenso"
3. Cliccando sul pulsante rosso "Revoca Consenso Cookie"

## Accessibilità

- ✅ Focus trap durante la visualizzazione del banner
- ✅ Screen reader friendly con ARIA labels
- ✅ Navigazione da tastiera supportata
- ✅ Alto contrasto in dark mode

## Conformità GDPR

Il sistema è conforme al GDPR perché:
- ✅ Chiede consenso **prima** di impostare cookie non necessari
- ✅ Fornisce informazioni chiare sulle categorie di cookie
- ✅ Permette scelte granulari
- ✅ Consente facile revoca del consenso
- ✅ Non utilizza cookie wall (utente può rifiutare)

## Testing

### Testare il Banner

1. Cancella localStorage: `localStorage.removeItem('cookie-consent')`
2. Ricarica la pagina
3. Il banner dovrebbe apparire

### Verificare Google Analytics

1. Accetta i cookie analitici
2. Apri DevTools > Console
3. Digita: `window.dataLayer`
4. Dovresti vedere gli eventi GA se configurato

## Troubleshooting

### Il banner non appare
- Controlla se `cookie-consent` è in localStorage
- Rimuovilo e ricarica la pagina

### Google Analytics non funziona
- Verifica che `NEXT_PUBLIC_GA_MEASUREMENT_ID` sia impostato
- Controlla che i cookie analitici siano accettati
- Verifica in DevTools che lo script GA sia caricato

### Stili non applicati
- Verifica che Tailwind CSS sia configurato correttamente
- Controlla che non ci siano conflitti CSS

## Manutenzione

### Aggiornare la Cookie Policy
Modifica il file: `/src/app/(frontend)/cookie-policy/page.tsx`

### Logging
Il componente logga errori nella console:
```javascript
console.error('Errore nel parsing delle preferenze cookie:', error)
```

## Supporto

Per domande o problemi, contatta: quintavalle.christian@gmail.com
