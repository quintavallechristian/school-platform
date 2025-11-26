# Sistema di Prenotazione Eventi Calendario

## Panoramica
Il sistema permette agli amministratori di rendere gli eventi del calendario prenotabili dai genitori. Quando un genitore prenota, viene creato un `ParentAppointment` che può richiedere approvazione dello school-admin.

## Funzionalità Implementate

### 1. CalendarDays Collection (Aggiornata)
Nuovi campi aggiunti:
- **isBookable** (checkbox): Abilita le prenotazioni per questo evento
- **bookingSettings** (group): Impostazioni della prenotazione
  - `maxCapacity`: Numero massimo di prenotazioni
  - `bookingDeadline`: Data limite per prenotare
  - `location`: Luogo dell'appuntamento
  - `duration`: Durata prevista in minuti
  - `requiresApproval`: Se le prenotazioni richiedono approvazione (default: true)

### 2. ParentAppointments Collection (Aggiornata)
Modifiche:
- **calendarEvent**: Nuovo campo relazione con `calendar-days`
- **status**: Aggiunti nuovi stati:
  - `pending`: In attesa di approvazione
  - `rejected`: Rifiutato dall'admin
- **access.create**: Ora anche i genitori possono creare appuntamenti (per le prenotazioni)
- **defaultValue**: Cambiato da `scheduled` a `pending`

### 3. API Endpoint: `/api/book-event`
Endpoint POST per creare prenotazioni.

**Autenticazione**: Richiede cookie `payload-token` (solo genitori)

**Request Body**:
```json
{
  "calendarEventId": "string"
}
```

**Validazioni**:
- ✅ Verifica che l'evento sia prenotabile
- ✅ Controlla la scadenza prenotazioni
- ✅ Verifica capacità massima
- ✅ Previene prenotazioni duplicate dello stesso utente

**Response Success**:
```json
{
  "success": true,
  "appointment": {...},
  "message": "Prenotazione inviata! Riceverai una conferma quando verrà approvata."
}
```

## Workflow di Utilizzo

### Per l'Amministratore
1. Creare un evento nel calendario
2. Abilitare "Prenotabile"
3. Configurare le impostazioni:
   - Numero di posti
   - Scadenza prenotazioni
   - Se richiede approvazione
   - Luogo e durata
4. Quando i genitori prenotano, approvare/rifiutare dalla sezione "Appuntamenti Genitori"

### Per i Genitori
1. Visualizzare il calendario sul frontend
2. Cliccare su "Prenota" per l'evento desiderato
3. Se richiede approvazione: attendere conferma
4. Se non richiede approvazione: appuntamento confermato automaticamente

## Stati degli Appuntamenti
- **pending**: In attesa di approvazione dallo school-admin
- **scheduled**: Approvato e programmato
- **completed**: Appuntamento concluso
- **cancelled**: Annullato dal genitore
- **rejected**: Rifiutato dall'amministratore
