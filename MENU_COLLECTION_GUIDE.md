# Guida alla Gestione del Menù della Mensa

## Struttura del Menù

Ogni menù (es. "Menù Autunno 2025", "Menù Inverno 2025") contiene **obbligatoriamente tutte e 4 le settimane**.
Le settimane sono organizzate in **tab orizzontali** nell'interfaccia di amministrazione, rendendo facile la compilazione.

## Come creare un nuovo menù stagionale

1. **Accedi al pannello di amministrazione**
   - Vai su `/admin`
   - Effettua il login con le tue credenziali

2. **Crea un nuovo menù**
   - Nel menu laterale, clicca su "Menu"
   - Clicca sul pulsante "Create New"

3. **Compila i campi principali** (visibili nella sidebar)
   - **Nome**: Dai un nome al menù (es. "Menù Autunno 2025", "Menù Inverno 2025")
   - **Menù Attivo**: Spunta questa casella per rendere il menù visibile sul sito
     - ⚠️ **IMPORTANTE**: Solo UN menù può essere attivo alla volta
     - Quando attivi un nuovo menù, ricordati di disattivare quello precedente
   - **Valido dal**: Data di inizio validità (opzionale)
   - **Valido fino al**: Data di fine validità (opzionale)
   - **Note Generali**: Note valide per tutto il menù (es. informazioni sugli allergeni)

4. **Compila le 4 settimane** (usando le tab orizzontali)

   Per ogni settimana vedrai i tab: **Settimana 1**, **Settimana 2**, **Settimana 3**, **Settimana 4**

   All'interno di ogni settimana:
   - Compila il menù per ogni giorno (Lunedì - Venerdì)
   - Per ogni giorno:
     - **Piatto Unico**: Spunta se è un piatto unico
     - **Piatti**: Clicca "Add Piatti" per aggiungere ogni piatto
       - Inserisci la descrizione (es. "Pasta al pomodoro")
       - Puoi aggiungere più piatti cliccando nuovamente su "Add Piatti"
   - **Note settimana**: Note specifiche per quella settimana (opzionale)

5. **Salva**
   - Clicca su "Save" per salvare il menù completo

## Esempio di compilazione

### Lunedì - Settimana 1

- ☐ Piatto Unico
- Piatti:
  - "Risotto o orzotto con verdure di stagione"
  - "Uovo sodo o frittata al forno"
  - "Cappucci"
  - "Fagiolini all'olio"

### Mercoledì - Settimana 1 (Piatto Unico)

- ☑ Piatto Unico
- Piatti:
  - "Stuzzichino di finocchio, carote e sedano"
  - "Spezzatino di manzo con polenta e patata al vapore"
  - "Passato di verdura con pasta, riso o altro cereale"

## Visualizzazione

I menù saranno automaticamente visibili sulla pagina `/mensa` del sito.

- Viene mostrato solo il menù attivo
- Tutte e 4 le settimane sono visualizzate in una tabella
- Il nome del menù appare nel sottotitolo della pagina

## Gestione Stagionale

### Passare da un menù stagionale all'altro

**Esempio: Passaggio da Autunno a Inverno**

1. Vai nella lista "Menu"
2. Apri il "Menù Autunno 2025" e disattiva il flag "Menù Attivo"
3. Salva
4. Apri (o crea) il "Menù Inverno 2025" e attiva il flag "Menù Attivo"
5. Salva

Il sito mostrerà automaticamente il nuovo menù invernale con tutte e 4 le settimane!

### Preparare menù in anticipo

Puoi creare menù stagionali in anticipo senza attivarli:

- Crea "Menù Primavera 2026" con tutte le settimane compilate
- Lascia "Menù Attivo" deselezionato
- Quando sarà il momento, attiva questo menù e disattiva quello precedente

### Archiviazione

- I vecchi menù rimangono nel sistema anche se disattivati
- Non è necessario eliminarli
- Puoi riutilizzarli o modificarli per le stagioni successive

## Note tecniche

- La collection si trova in: `/src/collections/Menu.ts`
- La pagina frontend si trova in: `/src/app/(frontend)/mensa/page.tsx`
- Puoi gestire fino a 4 settimane diverse
- Ogni settimana può essere modificata o eliminata dal pannello admin
