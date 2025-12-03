# Sistema di Accettazione Obbligatoria Privacy Policy e ToS

## Panoramica

Questo sistema garantisce che tutti gli utenti (school-admin, editor, parent) debbano accettare la Privacy Policy e i Termini di Servizio prima di poter utilizzare l'area admin della piattaforma.

## Come Funziona

### 1. Campi nel Database (Users Collection)

Sono stati aggiunti tre nuovi campi alla collezione `Users`:

- **`acceptedPrivacyPolicy`** (boolean): Indica se l'utente ha accettato la Privacy Policy
- **`acceptedTermsOfService`** (boolean): Indica se l'utente ha accettato i Termini di Servizio
- **`acceptanceDate`** (date): Data e ora in cui l'utente ha accettato entrambi i documenti

Questi campi sono visibili nella sidebar dell'admin ma sono in sola lettura per gli amministratori.

### 2. Componenti React

#### `TermsAcceptanceBanner.tsx`
Componente che:
- Si renderizza come overlay a schermo intero sopra l'interfaccia admin
- Controlla se l'utente loggato ha già accettato i termini
- Se NON ha accettato, mostra un modal non dismissibile
- Il modal contiene:
  - Due checkbox obbligatorie (una per Privacy Policy, una per ToS)
  - Link cliccabili ai documenti (si aprono in nuova tab)
  - Pulsante "Accetta e continua" (abilitato solo se entrambe le checkbox sono selezionate)
- Utilizza le variabili CSS di Payload per integrarsi perfettamente con il tema dell'admin

#### `TermsAcceptanceBanner.css`
File CSS che definisce gli stili del banner usando le variabili CSS native di Payload (`--theme-elevation-*`) per garantire compatibilità con modalità chiara/scura.


### 3. Endpoint API

**`/api/users/accept-terms`** (POST)
- Endpoint sicuro che verifica l'autenticazione dell'utente
- Aggiorna i campi `acceptedPrivacyPolicy`, `acceptedTermsOfService` e `acceptanceDate`
- Restituisce errore 401 se l'utente non è autenticato

### 4. Integrazione con Payload CMS

Nel file `payload.config.ts`, il banner è stato aggiunto alla configurazione admin usando `afterNavLinks`:

```typescript
admin: {
  components: {
    afterNavLinks: ['/components/TermsAcceptanceBanner#TermsAcceptanceBanner'],
  },
}
```

Questo approccio:
- ✅ Non interferisce con il rendering delle collezioni nella sidebar
- ✅ Si integra perfettamente con l'UI esistente
- ✅ Viene renderizzato dopo i link di navigazione ma prima del contenuto principale


## Flusso Utente

1. **School Admin invita un nuovo Editor**
   - Crea un nuovo utente con ruolo "Editor"
   - L'editor riceve un'email con le credenziali

2. **Editor effettua il primo login**
   - Inserisce email e password
   - Viene autenticato con successo

3. **Modal di Accettazione**
   - Appena loggato, l'editor vede il modal di accettazione
   - NON può chiudere il modal o accedere all'admin
   - Deve leggere e accettare entrambi i documenti

4. **Accettazione**
   - L'editor seleziona entrambe le checkbox
   - Clicca "Accetta e continua"
   - Il sistema registra l'accettazione nel database
   - La pagina si ricarica e l'editor può ora utilizzare l'admin normalmente

5. **Login Successivi**
   - Nei login successivi, il sistema verifica che l'utente abbia già accettato
   - Se sì, l'utente accede direttamente all'admin senza vedere il modal

## Sicurezza

- ✅ L'endpoint API verifica l'autenticazione prima di aggiornare i dati
- ✅ I campi di accettazione sono in sola lettura nell'admin UI
- ✅ La data di accettazione viene registrata per tracciabilità
- ✅ Il modal non può essere chiuso senza accettare

## Personalizzazione

### Modificare i Link ai Documenti

Nel file `TermsAcceptanceBanner.tsx`, modifica gli href:

```tsx
<a href="/privacy-policy" target="_blank">Privacy Policy</a>
<a href="/tos" target="_blank">Termini di Servizio</a>
```

### Modificare lo Stile del Modal

Gli stili sono definiti nel file `TermsAcceptanceBanner.css`. Puoi modificarli mantenendo le variabili CSS di Payload per garantire la compatibilità con il tema.

### Escludere Ruoli Specifici

Se vuoi che alcuni ruoli (es. super-admin) non vedano il modal, modifica la logica in `TermsAcceptanceBanner.tsx`:

```tsx
useEffect(() => {
  if (user) {
    // Escludi super-admin
    if (user.role === 'super-admin') {
      setNeedsAcceptance(false)
      return
    }
    
    // ... resto della logica
  }
}, [user])
```


## Testing

Per testare il sistema:

1. Crea un nuovo utente editor
2. Effettua il logout dal tuo account admin
3. Effettua il login con le credenziali del nuovo editor
4. Verifica che appaia il modal di accettazione
5. Prova a navigare (non dovrebbe essere possibile)
6. Accetta i termini
7. Verifica che ora puoi accedere all'admin
8. Effettua logout e login di nuovo
9. Verifica che il modal NON appaia più

## Note Importanti

- Il sistema si applica a TUTTI gli utenti che accedono all'admin (tranne quelli esplicitamente esclusi)
- I genitori (role: 'parent') non accedono all'admin quindi non vedranno mai questo modal
- La data di accettazione è importante per conformità GDPR
- Se i termini cambiano, potresti voler resettare i flag di accettazione per tutti gli utenti
